/* Copyright © 2016 Nokia. All rights reserved. */
/* This file was created by Nokia employee Joan Moraleda on January, 2016. */
SDK = (function() {

	var source, origin, postMessage, keyCodes;
	var listeners = {};
	
	function receiveFirstMessage(ev) {
		source = ev.source;
		origin = ev.origin;
		window.removeEventListener("message", receiveFirstMessage);
		window.addEventListener("message", receiveMessage, false);
		receiveMessage(ev);
	}

	function receiveMessage(ev) {
		var id = ev.data.id;
		if(listeners[id]) {
			listeners[id](ev.data.result);
			if(ev.data.id.indexOf("msg_") === 0) delete listeners[id];
		}
	}

	if(typeof sdkSTB === "object") {
		sdkSTB.addEventListener(receiveMessage);
		postMessage = sdkSTB.postMessage;
		keyCodes = sdkSTB.keys;
	} else {
		window.addEventListener("message", receiveFirstMessage, false);
		postMessage = function(msg) {
			if(source) {
				delete msg.callback;
				source.postMessage(msg, origin);
			}
		};
		keyCodes = {
			KEY_0 : 48,					// 0
			KEY_1 : 49,					// 1
			KEY_2 : 50,					// 2
			KEY_3 : 51,					// 3
			KEY_4 : 52,					// 4
			KEY_5 : 53,					// 5
			KEY_6 : 54,					// 6
			KEY_7 : 55,					// 7
			KEY_8 : 56,					// 8
			KEY_9 : 57,					// 9
			KEY_OK : 13,				// ENTER
			KEY_LEFT : 37,				// LEFT
			KEY_UP : 38,				// UP
			KEY_RIGHT : 39,				// RIGHT
			KEY_DOWN : 40,				// DOWN
			KEY_BACK : 8,				// <---- (delete)
			KEY_PLAY : 80,				// P
			KEY_PAUSE : 19,				// Pause/Break
			KEY_PLPAUSE : 85,			// U
			KEY_FORWARD : 70,			// F
			KEY_REWIND : 82,			// R
			KEY_STOP : 83,				// S
			KEY_RECORD : 45,			// Insert
			KEY_PROG_UP : 33,			// Page Up
			KEY_PROG_DN : 34,			// Page Down
			KEY_RED : 112,				// F1
			KEY_GREEN : 113,			// F2
			KEY_YELLOW : 114,			// F3
			KEY_BLUE : 115,				// F4
			KEY_MENU : 77,				// M
			KEY_HELP : 72,				// H
			KEY_EPG : 69,				// E
			KEY_TV : 84,				// T
			KEY_WWW : 87,				// W
			KEY_KEYB : 75,				// K
			KEY_TXT : 88				// X
		};
	}

	return {
		sendMessage : function(msg, callback) {
			if(typeof callback === "function") {
				var key = "msg_" + msg.type + "_" + msg.action + "_";
				var i = 0;
				while(listeners[key + i]) i++;
				key += i;
				listeners[key] = callback;
				msg.id = key;
			}
			postMessage(msg);
		},
		setListener : function(type, callback) {
			if(typeof callback === "function") {
				listeners[type] = callback;
				this.sendMessage({type : type, callback : callback, action : "SET_LISTENER"});
			} else
				this.removeListener(type);
		},
		removeListener : function(type) {
			delete listeners[type];
			this.sendMessage({type : type, action : "REMOVE_LISTENER"});
		},
		keys : keyCodes
	};
})();