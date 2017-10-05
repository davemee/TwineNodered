// via https://furkleindustries.com/fictions/twine/twine2_resources/twine2_macros/

var _state = State;
window._state = _state;
function getHarloweVariable(prop) {
	if (typeof(prop) === typeof(undefined) ||
			prop === '') {
		return;
	}	
	return prop[0] === '$' ? 
		_state.variables[prop.slice(1, prop.length)] : _state.variables[prop];
}
window.getHarloweVariable = getHarloweVariable;

function setHarloweVariable(prop, val) {
	if (typeof(prop) === typeof(undefined) ||
			prop === '' ||
			typeof(val) === typeof(undefined)) {
		return; 
	}
	if (prop[0] === '$') {
		prop = prop.slice(1, prop.length);  
	}
	_state.variables[prop] = val;
}
window.setHarloweVariable = setHarloweVariable;

var socket = new WebSocket("ws://"+window.location.hostname+":"+window.location.port+"/ws/game");

window.sendHarloweVariable = function(variableToSend) {
	var payload = {};
	payload[''+variableToSend]=getHarloweVariable(variableToSend);
	window.send(payload);
}

socket.onopen = function() {
	window.socket = socket;
	var send = function(dataToSend) {
		console.log("sending",dataToSend);
		socket.send(JSON.stringify(dataToSend));
	}
	window.send = send;
	var payload = { init: "init"};
	send(payload);
}

socket.onmessage = function (event) {
	console.log(event);
	var msg = JSON.parse(event.data);
	for (var key in msg) {
		window.setHarloweVariable( key, msg[key] );
	}
}







