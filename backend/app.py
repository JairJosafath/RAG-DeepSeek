from flask import Flask, jsonify, request

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


if __name__ == '__main__':
    app.run(host='0.0.0.0')
