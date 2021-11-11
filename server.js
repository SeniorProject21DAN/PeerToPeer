const express = require("express");
const app = express();
const http = require("http");
const WebSocket = require("ws");

const hosts = new Set();
const clients;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(message, isBinary) {
        console.log(message.toString(), isBinary);
        if (message.toString().substring(0, 3) === "host"){
            hosts.add(ws);
        } else if (message.toString().substring(0, 5) === "client") {
            clients.push(new Set());
        }
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on("close", function (){
        clients.delete(ws);
    });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

server.listen(8080, () => {
    console.log("Listening to port 8080");
});