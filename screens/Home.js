// 
// Extended by: Andrew Baker
// Date: 10.13.21

import React, { useState, useLayoutEffect } from 'react';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WebSocket from 'ws';

export default function Home() {
    const navigation = useNavigation();

    const Chat = () => {
        navigation.navigate('Chat');
    }

    const Server = () => {
        navigation.navigate('Burst');
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button
                    color='#007AFF'
                    onPress={Chat}
                    title="Chat"
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    color='#007AFF'
                    onPress={Server}
                    title="Server"
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