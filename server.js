const express = require("express");
const app = express();
const http = require("http");
const WebSocket = require("ws");

const hostList = new Set();
const connections = new Array();
// 153.106.92.43

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(message, isBinary) {
        console.log(message.toString(), isBinary);
        console.log(message);




        if (message.toString().substring(0, 3) === "host") {                    //Host set up
            if (hostExists(message.toString().substring(5, 10)) === -1){
                hostList.add(message.toString().substring(5, 10));
                connections.push(new Array(ws));
            } else {                                                            //Return Error, host already exists

            }

        } else if (message.toString().substring(0, 5) === "client") {           //Client or player set up 

            let host = hostExists(message.toString().substring(7, 12)); 
            if (host !== -1) {                                                  //Need to send confirmation message
                connection[host].push(ws);

            } else {                                                            //Send error message, host does not exist

            }
        } else {                                                                //Send error message, invalid input

        }
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

server.listen(8080, () => {
    console.log("Listening to port 8080");
});

function hostExists(name) {
    for (let i = 0; i < hostList.size(); i++) {
        if (hostList[i] === name) {
            return(i);
        }
    }
    return(-1);
}