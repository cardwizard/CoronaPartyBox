from flask import Flask, request, render_template, jsonify
import json

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/', methods=['GET'])
def index():
    return render_template('base.html')

if __name__ == '__main__':
    # start this web server
    app.run(host='127.0.0.1', port=8080)
