/*
 *
 * Test screen to try and work with sockets and peer to peer
 * Sender and reciever
 * Sender: press button to make something(probably a firework visual) happen
 * Reciever: waits, upon a press by the sender indicate recieving
 * Written by: Andrew Baker
 * Date: 10.14.21
 * 
 */

import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import io from "socket.io-client";

const Burst = ({ route }) => {
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const sendChannel = useRef(); // Data channel
    const { roomID } = route.params;
    const [messages, setMessages] = useState([]); // Chats between the peers will be stored here
  
    const navigation = useNavigation();

    useEffect(() => {
        console.log("1")
        // Step 1: Connect with the Signal server
        socketRef.current = io.connect("<http://153.106.226.103>:9000"); // Address of the Signal server
        console.log("2")
        // Step 2: Join the room. If initiator we will create a new room otherwise we will join a room
        socketRef.current.emit("join room", roomID); // Room ID
        console.log("3")
        // Step 3: Waiting for the other peer to join the room
        socketRef.current.on("other user", userID => {
            callUser(userID);
            otherUser.current = userID;
        });
        console.log("4")
        // Signals that both peers have joined the room
        socketRef.current.on("user joined", userID => {
            otherUser.current = userID;
        });
        console.log("5")
        socketRef.current.on("offer", handleOffer);
        console.log("6")
        socketRef.current.on("answer", handleAnswer);
        console.log("7")
        socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
    }, []);

    function callUser(userID) {
        // This will initiate the call for the receiving peer
        console.log("[INFO] Initiated a call")
        peerRef.current = Peer(userID);
        sendChannel.current = peerRef.current.createDataChannel("sendChannel");

        // listen to incoming messages from other peer
        sendChannel.current.onmessage = handleReceiveMessage;
    }

    function Peer(userID) {
        /* 
           Here we are using Turn and Stun server
           (ref: https://blog.ivrpowers.com/post/technologies/what-is-stun-turn-server/)
        */

        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });
        peer.onicecandidate = handleICECandidateEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);
        return peer;
    }

    function handleNegotiationNeededEvent(userID) {
        // Offer made by the initiating peer to the receiving peer.
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer);
        })
            .then(() => {
                const payload = {
                    target: userID,
                    caller: socketRef.current.id,
                    sdp: peerRef.current.localDescription,
                };
                socketRef.current.emit("offer", payload);
            })
            .catch(err => console.log("Error handling negotiation needed event", err));
    }

    function handleOffer(incoming) {
        /*
          Here we are exchanging config information
          between the peers to establish communication
        */
        console.log("[INFO] Handling Offer")
        peerRef.current = Peer();
        peerRef.current.ondatachannel = (event) => {
            sendChannel.current = event.channel;
            sendChannel.current.onmessage = handleReceiveMessage;
            console.log('[SUCCESS] Connection established')
        }

        /*
          Session Description: It is the config information of the peer
          SDP stands for Session Description Protocol. The exchange
          of config information between the peers happens using this protocol
        */
        const desc = new RTCSessionDescription(incoming.sdp);

        /* 
           Remote Description : Information about the other peer
           Local Description: Information about you 'current peer'
        */

        peerRef.current.setRemoteDescription(desc).then(() => {
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        // Handle answer by the receiving peer
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log("Error handle answer", e));
    }

    function handleReceiveMessage(e) {
        // Listener for receiving messages from the peer
        console.log("[INFO] Message received from peer", e.data);
    };

    function handleICECandidateEvent(e) {
        /*
          ICE stands for Interactive Connectivity Establishment. Using this
          peers exchange information over the intenet. When establishing a
          connection between the peers, peers generally look for several 
          ICE candidates and then decide which to choose best among possible
          candidates
        */
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    const sendBoom = () => {
        sendChannel.current.send("boom");
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button
                    color="blue"
                    onPress={sendBoom}
                    title="boom"
                />
            </View>
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

export default Burst;