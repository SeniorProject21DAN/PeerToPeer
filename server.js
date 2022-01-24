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

// Single dimension array storing name of host, used for host setup and client setup 
const hostList = new Array();
// Two dimensional array storing websocket address of host in [0] and of connected client n in [n]
const connections = new Array();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WORK TO BE DONE:
// Add row and column data to the connections, rather than roomColumn, 
//      for ease of understanding and to send messages from clients
//      to the host with client id in the message


wss.on("connection", function connection(ws) {
    // roomColumn is the slot of the both arrays the host or client exist within
    let roomColumn;
    // roomRow is the client number, hosts are default to 0, being the first in the row, with all clients starting at 1
    let roomRow;
    // roomID is the entered id, the "Host/Connection Code" of the host that the client connects to. The host's name
    let roomID;
    // boolean data, true for host, false for client
    let isHost;
    ws.on("message", function incoming(message, isBinary) {
        // console.log(message.toString(), isBinary);
        // console.log(message);

        if (messageType(message, "s", 0)) {                                         //s is startup signifier
            roomID = message.toString().substring(4, 9);
            if (messageType(message, "h", 2)) {                                     //Host set up
                if (hostExists(roomID) === -1) {
                    roomColumn = hostHole();                                           // Tests for a hole in connections, fills the hole
                    if (roomColumn !== -1) {
                        hostList[roomColumn] = roomID;
                        connections[roomColumn][0] = ws;
                    } else {                                                        // Creates new slot in the hostList
                        hostList.push(roomID);
                        connections.push(new Array());
                        roomColumn = connections.length - 1;
                        connections[roomColumn].push(ws);
                    }
                    roomRow = 0;
                    isHost = true;
                    console.log("Host Created!");
                    ws.send("Host Created!");

                } else {                                                            //Return Error, host already exists
                    console.log("Error in host connection: host already exists");
                    ws.send("Error in host connection: host already exists");
                    ws.close();
                }
            } else if (messageType(message, "c", 2)) {                              //Client or player set up 

                let host = hostExists(roomID);
                console.log("Host Number: " + host);
                if (host !== -1) {                                                  //Need to send confirmation message
                    connections[host].push(ws);
                    roomRow = connections.length;                                   //roomRow set to the length of connections, given that connections has just been incremented
                    roomColumn = host;
                    isHost = false;
                    console.log("Client Created!");
                    ws.send("Client Created!");
                } else {                                                            //Send error message, host does not exist
                    console.log("Error in client connection: host does not exist");
                    ws.send("Error in client connection: host does not exist");
                    ws.close();
                }
            } else {                                                                //Send error message, invalid input
                console.log("Error in connection: invalid input");
                ws.send("Error in connection: invalid input");
                ws.close();
            }
        } else if (messageType(message, "m", 0)) {                                  //If message
            if (isHost) {                                                           //If message sender is a host
                connections[roomColumn].forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(message.toString());
                        console.log("Sending Message");
                    }
                });
            } else {                                                                //If sender is a client, send messages exclusively to the host
                connections[roomColumn][0].send(roomRow + ":" + message.toString());
            }
        } else {                                                                    //Send error message, invalid input message
            console.log("Error: invalid Input");
            ws.send("Error: invalid Input");
            ws.close();
        }

        // CODE TO MAKE SERVER ECHO ALL INPUT MESSAGES
        // wss.clients.forEach(function each(client) {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(message.toString());
        //     }
        // });


    });
    ws.on("close", function () {
        console.log("Closed connection");
        if (isHost) {
            delete hostList[roomColumn];
            // delete connections[roomColumn];
            deleteClients(connections[roomColumn]);
            hostList[roomColumn] = -1;                 //additional change to reuse former room numbers, prevent server overflow
            // connections[roomColumn][0] = -1;
            console.log("Host Closed. Size of hostList: " + hostList.length);
        }
        // Currently when a connection closes only the host deletes values
        // When a client closes nothing happens, leaving its value within the connections array
        // It would be wise to add additional code to delete values from the connections array, however it get cleared when the host closes
        // Adding client deletion from connections array would require a y-value variable for client connections for the connections array
    });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

server.listen(8080, () => {
    console.log("Listening to port 8080");
});

function hostExists(name) {
    for (let i = 0; i < hostList.length; i += 1) {
        if (hostList[i] === name) {
            return (i);
        }
    }
    return (-1);
}

function messageType(message, role, position) {
    return (message.toString().substring(position, position + 1) === role);
}

function hostHole() {
    for (let i = 0; i < hostList.length; i += 1) {
        if (hostList[i] === -1) {
            return i;
        }
    }
    return -1;
}

function deleteClients(clientArray) {
    clientArray.forEach(function each(client) {
        delete client;
    }
    );
}