from typing import List
import pygetwindow as gw


def get_application() -> List:
    titles = gw.getAllTitles()
    titles = [x for x in titles if x]

    print("Choose the presentation window from the active windows below: ")

    for id1, title in enumerate(titles):
        print("{}. {}".format(id1+1, title))

    window_option = int(input("Enter the option number ({} - {})".format(1, len(titles))))
    return titles[window_option-1]
