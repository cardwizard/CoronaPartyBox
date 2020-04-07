from engine.sensor_stream import SensorStream
from yaml import safe_load
from time import sleep
from datetime import datetime
from engine.app_construct import get_application
from engine.simulate_keyboard import WindowsHook


def check_outlier(data, entry, threshold):
    data = [x[1][entry] for x in data]

    if max(data) - min(data) > threshold:
        return True
    return False


if __name__ == '__main__':

    with open("config.yaml", "r") as f:
        config = safe_load(f)

    presentation_app = get_application()
    w = WindowsHook(presentation_app)

    s = SensorStream(config["url"], filter_fields=["accel"])
    p = s.start_polling(0.1)

    now = datetime.now()
    i = 0
    sleep(1)
    prev_accel = None

    while i < 1000:
        sleep(0.1)
        accel_data = s.get_last_items(1)[0]["response"]["accel"]["data"]

        if prev_accel == accel_data:
            continue

        outlier = check_outlier(accel_data, 2, 10)
        print(outlier)

        if outlier:
            w.send_action(" ")

        prev_accel = accel_data
        i += 1
