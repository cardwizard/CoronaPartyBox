from flask import Flask, request, render_template, jsonify
from flask_socketio import SocketIO

app = Flask(__name__, static_folder='static', template_folder='templates')

app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")
# socketio = SocketIO(app)
player_counter = 0


@app.route('/')
def sessions():
    global player_counter
    player_counter = player_counter + 1
    return render_template('base.html', player_number=(player_counter%2) + 1)


@socketio.on('game_announcement')
def announce_to_all(json):
    print('received announcement')
    socketio.emit("act_game", json, json=True, broadcast=True)


@socketio.on('send_key_press')
def key_press_info(json):
    socketio.emit("get_key_press", json, json=True, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)
