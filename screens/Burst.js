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

import React, { useState, useLayoutEffect } from 'react';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Burst() {
    const navigation = useNavigation();

    const sendBoom = () => {

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