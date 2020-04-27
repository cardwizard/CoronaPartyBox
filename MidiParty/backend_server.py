from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
player_counter = 0


@app.route('/')
def sessions():
    global player_counter
    player_counter += 1
    return render_template('html/index.html', player_number=player_counter)


@socketio.on('message')
def handle_message(message):
    print('received message: ' + message)


@socketio.on('send_key_press')
def key_press_info(json):
    socketio.emit("get_key_press", json, json=True, broadcast=True)


@socketio.on('toggle_backend_game_state')
def key_press_info(json):
    socketio.emit("toggle_frontend_game_state", json, json=True, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)
