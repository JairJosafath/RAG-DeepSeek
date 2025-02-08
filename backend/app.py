from flask import Flask, jsonify, request,stream_with_context
from llm.chat import generate_response

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


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
