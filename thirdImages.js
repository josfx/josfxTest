/* Copyright © 2016 Nokia. All rights reserved. */
/* This file was created by Nokia employee Joan Moraleda on January, 2016. */

function debug(str) {
	str = "third party app::" + str;
	console.log(str);
}
debug("LOADED");

var timer;

SDK.setListener("APP", onAppMessage);

var images = ["./1.jpg", "./2.jpg", "./3.jpg"];
var imgIndex = 0;
var image = document.getElementById("image");
var keys = SDK.keys;

function moveImage(direction) {
	imgIndex = Math.abs(imgIndex + direction) % images.length;
	if(!image) image = document.getElementById("image");
	image.setAttribute('src', images[imgIndex]);
}

function onKeys(ev) {
	debug("onKeys " + JSON.stringify(ev));
	if(ev.event === "KEY_DOWN") {
		switch(ev.data.keyCode) {
			case keys.KEY_BACK: //back
				stop();
				break;
			case keys.KEY_LEFT://left
				moveImage(-1);
				break;
			case keys.KEY_RIGHT://right
				moveImage(1);
				break;
			case keys.KEY_PLAY: //play
				timer = setInterval(function() {
					moveImage(1);
				}, 1000);
				break;
			case keys.KEY_PAUSE: //pause
			case keys.KEY_PLPAUSE: //playpause
			case keys.KEY_STOP: //stop
				clearInterval(timer);
				break;
		}
	}
}

function stop() {
	clearInterval(timer);
	SDK.sendMessage({type : "APP", action : "STOPPED"});
}

function onAppMessage(ev) {
	debug("onAppMessage " + JSON.stringify(ev));
	switch(ev.event) {
		case "START":
			SDK.sendMessage({type : "APP", action : "STARTED"});
			SDK.setListener("KEYS", onKeys);
			SDK.sendMessage({type : "KEYS", action : "SUBSCRIBE", params : {keys : [keys.KEY_LEFT, keys.KEY_RIGHT, keys.KEY_BACK, keys.KEY_PLAY, keys.KEY_PAUSE, keys.KEY_PLPAUSE, keys.KEY_FORWARD, keys.KEY_REWIND, keys.KEY_STOP, keys.KEY_1, keys.KEY_2, keys.KEY_3, keys.KEY_4, keys.KEY_5, keys.KEY_6, keys.KEY_7, keys.KEY_8, keys.KEY_9]}});
			//SDK.sendMessage({type : "USER_INFO", action : "PARENTAL_PIN_AUTH"});
			break;
		case "STOP":
			stop();
			break;
	}
}
