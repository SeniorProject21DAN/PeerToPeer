const WebSocket = require("ws");
// var example = new WebSocket("ws:153.106.227.143:8080");
var example = new WebSocket("ws:153.106.226.103:8080");

example.onopen = function (event) {
    example.send("s:s:baker");
}

example.onmessage = function (event) {
    console.log(event.data);
}