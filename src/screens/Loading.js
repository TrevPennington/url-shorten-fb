import React from 'react';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';

export const Loading = () => {
    return (
        <View style={{ flex: 1, justifyContent: `center`, backgroundColor: `darkslategrey` }}>
            <StatusBar barStyle='light-content' />
            <ActivityIndicator size="large" color="#efefef" />
        </View>
    )
}