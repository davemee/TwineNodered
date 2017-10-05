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

// get lat,long
var lat = 0, long = 0;
function storeLatLong(position) {
	lat  = position.coords.latitude;
	long = position.coords.longitude;
}
navigator.geolocation.getCurrentPosition(storeLatLong);
/*
// do temperature stuff
function updateTemperature() {
	if( (lat!==0) && (long!==0) ) {
		var call = "http://api.openweathermap.org/data/2.5/weather?lat="+String(lat)+"&lon="+String(long)+"&appid=b99ed57bf10a3ea8e76987423fd198e2&units=metric";
		var req = XMLHttpRequest();

		req.onreadystatechange = function() {
			if (req.readyState == XMLHttpRequest.DONE ) {
				if (req.status == 200) {
					console.log(req);
					var data = JSON.parse(req.responseText);
					// via https://openweathermap.org/current
					setTemperature(data.main.temp);
				}
				else if (xmlhttp.status == 400) {
					console.log('There was an error 400');
				}
				else {
					console.log('something else other than 200 was returned');
				}
			}
		};

		req.open("GET", call, true);
		req.send();		
	} else {
		setTemperature(-100);
	}
}


function setTemperature(t) {
	window.setHarloweVariable(
		"temperature",t?t:-200 //Math.round((Math.random()*40)-10)
	);
}

var timerHandle = setInterval(function(){
	updateTemperature();
}, (15*60*1000 ) );
updateTemperature(); // initial ajax call
setTemperature(); // set a default while waiting
*/

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












