from typing import Dict, List
from time import sleep
from datetime import datetime

import requests
import threading


class SensorStream:

    def __init__(self, url, filter_fields=None, max_queue_size=1000) -> None:
        self.url = url
        self.filter_fields = filter_fields

        self.queue = []
        self.max_queue_size = max_queue_size

    def _get_response(self) -> Dict:

        try:
            response = requests.get(self.url).json()
            return response
        except Exception as e:
            print(e.__str__())
            return {}

    def get_response(self) -> Dict:
        response = self._get_response()

        if self.filter_fields is None:
            return response

        return {key: value for key, value in response.items() if key in self.filter_fields}

    def _start_polling(self, time_delay: int):

        while True:
            response = self.get_response()
            self._add_item(response)
            sleep(time_delay)

    def _add_item(self, response):
        # Limit by max queue size
        while len(self.queue) > self.max_queue_size:
            self.queue.pop()
        self.queue.append({"time_stamp": datetime.now(), "response": response})

    def get_last_items(self, count: int) -> List:
        return self.queue[-count:]

    def get_item_by_time(self, last_time) -> List:
        return list(filter(lambda x: x["time_stamp"] > last_time, self.queue))

    def start_polling(self, time_delay):
        t1 = threading.Thread(target=self._start_polling, args=(time_delay,))
        t1.start()
