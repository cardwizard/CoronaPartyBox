import keyboard
import pygetwindow as gw


class WindowsHook:
    def __init__(self, app_name):
        self.app_name = app_name

    def send_action(self, action) -> None:

        if gw.getActiveWindowTitle() != self.app_name:
            pass

        keyboard.press(action)
