// Home screen code for a peer to peer app basic Hello World app
// Based on: https://medium.com/nerd-for-tech/peer-to-peer-chat-app-using-webrtc-and-react-native-6c15759f92ec
// Extended by: Andrew Baker
// Date: 10.13.21

import React, { useState, useLayoutEffect } from 'react';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WebSocket from 'ws';

export default function Home() {
    const navigation = useNavigation();


    // const express = require("express");
    // const app = express();

    // const http = require("http");
    // const WebSocket = require("ws");

    // const server = http.createServer(app);
    // const wss = new WebSocket.Server({ server });

    // wss.on("connection", function connection(ws) {
    //     ws.on("message", function incoming(message, isBinary) {
    //         console.log(message.toString(), isBinary);

    //         wss.clients.forEach(function each(client) {
    //             if (client.readyState === WebSocket.OPEN) {
    //                 client.send(message.toString());
    //             }
    //         });
    //     });
    // });

    // app.get("/", (req, res) => {
    //     res.send("Hello World!");
    // });

    // server.listen(8080, () => {
    //     console.log("Listening to port 8080");
    // });


    return (
        <View style={styles.container}>
            <Text>Home</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8FF',
    },
    textInput: {
        height: 55,
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 18,
        backgroundColor: '#fff',
        borderWidth: .5,
    },
    inputContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        margin: 10,
    },
    buttonContainer: {
        padding: 15,
    },
    textStyle: {
        alignSelf: 'center',
        color: '#D3D3D3',
        marginTop: 5,
    },
    errorStyle: {
        alignSelf: 'center',
        color: '#ff0000',
        marginBottom: 5,
        fontSize: 12,
    }
});