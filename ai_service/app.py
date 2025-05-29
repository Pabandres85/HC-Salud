from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/predict', methods=['GET'])
def predict():
    return jsonify({"message": "Este es un servicio IA placeholder listo para integrar modelos."})

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "Servicio AI activo y funcionando."})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7000)
