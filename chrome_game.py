from engine.sensor_stream import SensorStream
from yaml import safe_load
from time import sleep
from datetime import datetime

if __name__ == '__main__':
    with open("config.yaml", "r") as f:
        config = safe_load(f)

    s = SensorStream(config["url"], filter_fields=["accel"])
    p = s.start_polling(1)

    now = datetime.now()
    i = 0
    while i < 10:
        sleep(1)
        print(len(s.get_item_by_time(now)))
        i += 1
