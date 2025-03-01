from flask import Flask, jsonify, request, json, Response, stream_with_context
from vector_database.loader import embed_file
from vector_database.store import list_documents, delete_document, get_or_create_vector_store
from llm.chat import generate_response
from llm.client import list_models
from requests.models import Response as Response_
import requests

app = Flask(__name__)


@app.route('/')
def hello():
    return jsonify({
        "message": "Hello from Flask!"
    })


@app.route('/echo', methods=['POST'])
def echo():
    data = request.get_json()
    return jsonify(data)


@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    selected_documents = data.get('selectedDocuments', [])

    # Get the vector store and filter by selected documents if any
    vector_store = get_or_create_vector_store()
    if selected_documents:
        # Filter the vector store to only use selected documents
        vector_store = vector_store.as_retriever(
            search_kwargs={
                "filter": {"document_id": {"$in": selected_documents}}
            }
        )

    def generate():
        for chunk in generate_response(
            user_input=data['query'],
            model=data['model'],
            num_predict=data.get('num_predict', 2048),
            disable_streaming=data.get('disable_streaming', False),
            top_p=data.get('top_p', 0.9),
            top_k=data.get('top_k', 40),
            temperature=data.get('temperature', 0.7),
            vector_store=vector_store
        ):
            yield chunk.content
    return stream_with_context(generate()), 200, {'Content-Type': 'text/plain'}

@app.route('/document', methods=['POST'])
def document():
    if 'file' not in request.files:
        return "No file uploaded", 400
    
    file = request.files['file']
    title = request.form.get("title")

    try:
        embed_file(title=title, file=file)
        return "File embedded successfully", 200, {'Content-Type': 'text/plain'}
    except Exception as e:
        return str(e), 500, {'Content-Type': 'text/plain'}

@app.route('/documents', methods=['GET'])
def get_documents():
    try:
        docs = list_documents()
        return jsonify(docs)
    except Exception as e:
        return str(e), 500

@app.route('/document/<document_id>', methods=['DELETE'])
def remove_document(document_id):
    try:
        success = delete_document(document_id)
        if success:
            return "Document deleted successfully", 200
        return "Failed to delete document", 404
    except Exception as e:
        return str(e), 500

@app.route('/models')
def get_models():
    try:
        models = list_models()
        return models.model_dump_json()
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
