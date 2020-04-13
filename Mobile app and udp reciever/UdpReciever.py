#!/usr/bin/env python
# coding: utf-8

import socket
import keyboard
sock = socket.socket(socket.AF_INET,socket.SOCK_DGRAM)      # For UDP

udp_host = socket.gethostname()		        # Host IP
udp_port = 8888			                # specified port to connect

sock.bind((udp_host,udp_port))

while True:
	print("Waiting for client...")
	data,addr = sock.recvfrom(1024)	        #receive data from client
	print(data)
	if(data==bytes('1', 'utf-8')):
		keyboard.press_and_release('space')


