const WebSocket = require("ws");
var example = new WebSocket("ws:153.106.227.243:8080");

example.onopen = function (event) {
    example.send("s:c:baker");
    example.send("m:YO")
}

example.onmessage = function (event) {
    console.log(event.data);
}