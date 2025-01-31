from flask import Flask, jsonify, request, json, Response, stream_with_context
from vector_database.loader import embed_file
from llm.chat import generate_response
from requests.models import Response as Response_

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

    def generate():
        for chunk in generate_response(
            user_input=data['query'],
            model=data['model'],
            num_predict=data['num_predict'],
            disable_streaming=data['disable_streaming'],
        ):
            yield chunk.content
    return stream_with_context(generate()), 200, {'Content-Type': 'text/plain'}

@app.route('/document', methods=['POST'])
def document():
    if 'file' not in request.files:
        return "No file uploaded", 400
    
    file = request.files['file']
    title = request.form.get("title")
    file_size = request.form.get("size")
    file_type = request.form.get("type")
    
    # Process file metadata
    file_info = {
        "title": title,
        "size": file_size,
        "type": file_type
    }
    print("Received file:", file_info, flush=True)

    try:
        embed_file(title=title, file=file, size=file_size, type=file_type)
        return "File embedded successfully", 200, {'Content-Type': 'text/plain'}
    except Exception as e:
        return str(e), 500, {'Content-Type': 'text/plain'}


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
