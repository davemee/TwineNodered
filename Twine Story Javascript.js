// via and thanks to https://furkleindustries.com/fictions/twine/twine2_resources/twine2_macros/

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

socket.onopen = function() {
	socket.send("init");
}

socket.onmessage = function (event) {
	console.log(event);
	var msg = JSON.parse(event.data);
	for (var key in msg) {
		window.setHarloweVariable( key, msg[key] );
	}
}






