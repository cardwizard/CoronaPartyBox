from flask import Flask, render_template, request, jsonify
from pygame import mixer
from datetime import datetime

import random

app = Flask(__name__)
mixer.init()

started = False

last_played = datetime.now()
player_list = []
tasks = []
default_time = 2


@app.route("/")
def index():
    return render_template("index.html")


@app.route('/start_game', methods=["POST"])
def start_game():
    global started

    if not started:
        mixer.Channel(0).play(mixer.Sound("la-casa-de-papel-theme-song.wav"), -1)
        mixer.Channel(0).pause()
        started = True
        # Add the first task!
        tasks.append({"id": 0, "player": random.choices(player_list)[0],
                      "word": "".join([str(random.randint(0, 4))])})
    else:
        print("Game Started!")
    return tasks[-1], 200


@app.route('/play', methods=["POST"])
def play():
    global last_played
    cur_time = datetime.now()

    if (cur_time - last_played).total_seconds() < default_time:
        last_played = cur_time
        return {}, 200

    last_played = cur_time

    mixer.Channel(0).unpause()
    previous_id = tasks[-1]["id"]
    # Add next task
    tasks.append({"id": previous_id + 1, "player": random.choices(player_list)[0],
                  "word": "".join([str(random.randint(0, 4))])})

    return {}, 200


@app.route('/pause', methods=["POST"])
def pause():
    global last_played

    if (datetime.now() - last_played).total_seconds() < default_time:
        return {}, 200

    mixer.Channel(0).pause()
    return {}, 200


@app.route('/register_player', methods=["POST"])
def register_player():
    player_info = request.form["name"]

    if player_info not in player_list:
        player_list.append(player_info)

    return {}, 200


@app.route('/next_task', methods=["GET"])
def get_task():
    if len(tasks) == 0:
        return {}, 200
    else:
        return tasks[-1], 200


if __name__ == '__main__':
    app.run()
