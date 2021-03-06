// 
// Extended by: Andrew Baker
// Date: 10.13.21

import React, { useState, useLayoutEffect } from 'react';
import { Text, View, Button, TextInput, StyleSheet, Vibration } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Client() {
    const navigation = useNavigation();

    // const [serverState, setServerState] = React.useState('Loading...');
    const [messageText, setMessageText] = React.useState('');
    // const [disableButton, setDisableButton] = React.useState(true);
    // const [inputFieldEmpty, setInputFieldEmpty] = React.useState(true);
    // const [serverMessages, setServerMessages] = React.useState([]);

    var ws = React.useRef(new WebSocket('ws:153.106.227.243:8080')).current;   //This needs to altered to the IP of the server when attempting to get this to run. Double check each time. 


    React.useEffect(() => {
        const serverMessagesList = [];
        ws.onopen = () => {
            ws.send("s:c:baker");
            // setServerState('Connected to the server')
            // setDisableButton(false);
        };
        ws.onclose = (e) => {
            // setServerState('Disconnected. Check internet or server.')
            // setDisableButton(true);
        };
        ws.onerror = (e) => {
            // setServerState(e.message);
        };
        ws.onmessage = (e) => {
            // console.log(e);
            if (e.data == "m:buzz"){
                Vibration.vibrate();
            }
            // serverMessagesList.push(e.data);
            // setServerMessages([...serverMessagesList])
        };
    }, [])

    const send = () => {
        console.log("placeholder");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textStyle}>Player Waiting for Buzz</Text>
            {/* <View style={styles.buttonContainer}>
                <Button
                    color='#007AFF'
                    onPress={send}
                    title="Client send"
                />
            </View> */}
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
        backgroundColor: '#fff',
        fontSize: 18,
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