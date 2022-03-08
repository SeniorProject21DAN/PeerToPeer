const WebSocket = require("ws");
var example = new WebSocket("ws:153.106.226.71:8080");
// var example = new WebSocket("ws:153.106.226.103:8080");

example.onopen = function (event) {
    example.send("s:c:072lu:ANDREW");
    // example.send("m:YO");
}

example.onmessage = function (event) {
    console.log(event.data);
}