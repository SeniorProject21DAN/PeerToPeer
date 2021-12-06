/*
 * Written by: Andrew Baker
 * Date: 11.18.21
 * Websocket server for cast and control
 * messages sent in in the following format
 * <type>:<role>:<roomID>:<OPTIONALmessage>
 *      Example s:h
 *      m:c:54;12;T
 * <type> m=message, s=startup
 * <role> h=host, c=client
 */

const express = require("express");
const app = express();
const http = require("http");
const WebSocket = require("ws");

const hostList = new Array();
const connections = new Array();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
    let roomNum;
    let isHost;
    let roomID;
    ws.on("message", function incoming(message, isBinary) {
        console.log(message.toString(), isBinary);
        // console.log(message);

        if (messageType(message, "s", 0)) {                                         //s is startup signifier
            if (messageType(message, "h", 2)) {                                     //Host set up
                if (hostExists(message.toString().substring(4, 9)) === -1) {
                    hostList.push(message.toString().substring(4, 9));
                    connections.push(new Array());
                    roomNum = connections.length - 1;
                    connections[roomNum].push(ws);
                    isHost = true;
                    roomID = message.toString().substring(4, 9);
                    console.log("Host Created!");
                    ws.send("Host Created!");
                } else {                                                            //Return Error, host already exists
                    console.log("Error in host connection: host already exists");
                    ws.send("Error in host connection: host already exists");
                }
            } else if (messageType(message, "c", 2)) {                              //Client or player set up 

                let host = hostExists(message.toString().substring(4, 9));
                if (host !== -1) {                                                  //Need to send confirmation message
                    connections[host].push(ws);
                    roomNum = host;
                    isHost = false;
                    roomID = message.toString().substring(4, 9);
                    console.log("Client Created!");
                    ws.send("Client Created!");
                } else {                                                            //Send error message, host does not exist
                    console.log("Error in client connection: host does not exist");
                    ws.send("Error in client connection: host does not exist");
                }
            } else {                                                                //Send error message, invalid input
                console.log("Error in connection: invalid input");
                ws.send("Error in connection: invalid input");
            }
        } else if (messageType(message, "m", 0)) {                                   //If message
            if (isHost) {
                connections[roomNum].forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message.toString());
                    }
                });
            } else {
                connections[roomNum][0].send(message.toString());
            }
        } else {                                                                    //Send error message, invalid input
            console.log("Error: invalid Input");
            ws.send("Error: invalid Input");
        }

        // wss.clients.forEach(function each(client) {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(message.toString());
        //     }
        // });


    });
    ws.on("close", function () {
        console.log("Closed connection");
        if (isHost){
            delete hostList[roomNum];
            delete connections[roomNum];
        }
    });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

server.listen(8080, () => {
    console.log("Listening to port 8080");
});

function hostExists(name) {
    for (let i = 0; i < hostList.length; i = i + 1) {
        if (hostList[i] === name) {
            return (i);
        }
    }
    return (-1);
}

function messageType(message, role, position) {
    return (message.toString().substring(position, position + 1) === role);
}