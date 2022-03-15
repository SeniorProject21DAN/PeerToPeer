const WebSocket = require("ws");
var example = new WebSocket("ws:153.106.226.103:8080");

example.onopen = function (event) {
    example.send("s:c:baker:ANDREW");
    // example.send("m:YO");
    for (let i = 0; i < 30; i++){
        example.send("m:hey:you:" + i);
    }
}

example.onmessage = function (event) {
    console.log(event.data);
}