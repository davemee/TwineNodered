# TwineNodered
Pieces to feed data into Twine2 from Node-Red, as well as serve games from a Node-Red server.

Also some little hacks for the ["Connecting Sensors to Internet with LoRaWAN" — Hackday](https://www.meetup.com/iotliverpool/events/240479864/)

## Getting Started

First clone or copy this repo somehwere

You then need `npm` Node.js' package manager that comes bundled with Node.js

 * Install [Node.js](https://nodejs.org/en/download/)

 * [Install](https://nodered.org/docs/getting-started/installation) `node-red` following [this guide](https://nodered.org/docs/getting-started/) 

Basically install with `sudo npm install -g --unsafe-perm node-red`

 If you have installed Node-RED as a global npm package, you can use the `$ node-red` command and then you'll see it start up.:

```
 $ node-red

 Welcome to Node-RED
 ===================

 25 Jun 22:51:09 - [info] Node-RED version: v0.17.4
 25 Jun 22:51:09 - [info] Node.js  version: v6.11.1
 25 Jun 22:51:09 - [info] Loading palette nodes
 25 Jun 22:51:10 - [warn] ------------------------------------------
 25 Jun 22:51:10 - [warn] [rpi-gpio] Info : Ignoring Raspberry Pi specific node
 25 Jun 22:51:10 - [warn] ------------------------------------------
 25 Jun 22:51:10 - [info] Settings file  : /home/nol/.node-red/settings.js
 25 Jun 22:51:10 - [info] User Directory : /home/nol/.node-red
 25 Jun 22:51:10 - [info] Server now running at http://127.0.0.1:1880/
 25 Jun 22:51:10 - [info] Creating new flows file : flows_noltop.json
 25 Jun 22:51:10 - [info] Starting flows
 25 Jun 22:51:10 - [info] Started flows
```

You can then access the Node-RED editor in your browser at `http://localhost:1880`.

There are specific instructions available for certain hardware platforms:

  * [Raspberry Pi](https://nodered.org/docs/hardware/raspberrypi)

### Using the TwineNodered Flow

Next we copy the text in **Example Node-Red Flow** and in our node-red window we Import the clipboard contents to a New Flow. Paste in the text in the window.

Hit Deploy in the top right and it will start to run. In the example the flow will run and also serve the game you've made in Twine

You can recognise the basic steps
 * A websocket in
 * An `init` initialiser switch
 * An hourly trigger
 * An `http` request function
 * A JSON parser
 * A `get temperature` function carrying `msg.payload` to the websocket
  ```
  var temperature = msg.payload.main.temp;
  msg.payload = {"temperature": temperature};

  return msg;
  ```
  This becomes the Twine variable `$temperature`
* A [ws] websocket out to the game endpoint 

 * an `http` input; an endpoint for the game
 * a template with the gamecode in html in it to receive the msg from the websocket
 * a `http` response output so we can see the game html in the template being served

You should be able to work out how to change the `get temperature` function to access other data and make new variables.

## Twine

 * For the example you'll need to use the Harlowe 1.2.4 story format so change that in Twine
 * Now Edit Story Javascript and paste in the [Twine Story Javascript.js](https://github.com/davemee/TwineNodered/blob/master/Twine%20Story%20Javascript.js)
 
```
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
```

 * Make a `Title` passage
 ```
 This is the title page.

 It is needed so data can be initialised before the player starts.

 [[Start the game!->Start]]
 ```
 * Make a `Start` passage
 ```
 The temperature is $temperature.
 <!--Here the value of temperature reveals a [[hot|hot]] or a [[cold|cold]] link-->
 It is (if: $temperature>10)[ [[Hot->Hot]] ](if: $temperature<=10)[ [[Cold->Cold]] ]

 [[Check temperature again!->Start]]
 ```
 * Make a `hot` and `cold` passage for logic

 Play and make more! Try adding the `JSON` from [open-notify](http://api.open-notify.org/astros.json)
