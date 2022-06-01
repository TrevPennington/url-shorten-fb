import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, SafeAreaView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useAuthContext } from '../context/AuthContext'

export const Auth = () => {
    const authContext = useAuthContext();

    const [loading, setLoading] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const createAccount = async () => {

        if (password !== passwordTwo) {
            setErrorMessage('passwords do not match!')
        } else {
            setLoading(true);
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((d) => {
                    createFirebaseUser();
                })
                .catch(error => {
                    setLoading(false);
                    setErrorMessage(error.code)
                });
        }
    }

    const logIn = () => {
        setLoading(true);
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User account signed in!');
            })
            .catch(error => {
                setLoading(false);
                setErrorMessage(error.code)
            });
    }

    const createFirebaseUser = () => {
        firestore()
            .collection('users')
            .doc(authContext.authUser.uid)
            .set({
              email: d.user.email,
            })
            .then(() => {
                console.log('user created!')
            })
            .catch(error => {
                setLoading(false);
                setErrorMessage(error.code)
            });
    }

    useEffect(() => {
        setErrorMessage(''); // clear error on change text / change render
    }, [email, password, passwordTwo, isLoggingIn])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: `darkslategrey` }}>
            <Text style={styles.title}>Welcome to URL Shortener 👋</Text>

            <View style={styles.contentContainer}>
                <Text style={styles.subTitle}>{isLoggingIn ? `Log in to your account` : `Create an account` }</Text>
                <TextInput 
                    style={styles.textInput}
                    placeholder='email'
                    value={email}
                    onChangeText={(t) => setEmail(t)}
                    keyboardType='email-address'
                />
                <TextInput 
                    style={styles.textInput}
                    placeholder='password'
                    value={password}
                    onChangeText={(t) => setPassword(t)}
                    secureTextEntry
                />
                { !isLoggingIn &&
                    <TextInput 
                        style={styles.textInput}
                        placeholder='password again'
                        value={passwordTwo}
                        onChangeText={(t) => setPasswordTwo(t)}
                        secureTextEntry
                    />
                }
                <View style={styles.errorContainer}>
                    <Text style={styles.errorMessageLabel}>
                        {errorMessage}
                    </Text>
                </View>
                <View style={styles.optionsContainer}>
                    <Pressable
                        style={styles.button}
                        onPress={isLoggingIn ? logIn : createAccount}
                    >
                        { loading ?
                            <ActivityIndicator />
                        :
                            <Text>
                                {isLoggingIn ? `log in` : `create account`}
                            </Text>
                        }
                    </Pressable>

                    <Pressable
                        onPress={() => setIsLoggingIn((v) => !v)}
                    >
                        <Text style={styles.optionLabel}>{isLoggingIn ? `Create account instead` : `Log in instead`}</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        color: `#efefef`,
        fontSize: 24,
        fontWeight: `700`,
        marginHorizontal: 24
    },
    contentContainer: {
        marginTop: 20,
        
    },
    subTitle: {
        color: `#efefef`,
        fontSize: 18,
        textAlign: `center`
    },
    textInput: {
        marginTop: 12,
        backgroundColor: `#efefef`,
        marginHorizontal: 16,
        paddingHorizontal: 12,
        height: 42,
        justifyContent: `center`,
        borderRadius: 6,
    },
    errorContainer: {
        height: 32
    },
    errorMessageLabel: {
        color: `crimson`,
        textAlign: `center`,
        marginTop: 12
    },
    optionsContainer: {
        alignItems: `center`,
        justifyContent: `space-between`,
    },
    button: {
        marginTop: 12,
        backgroundColor: `skyblue`,
        height: 42,
        justifyContent: `center`,
        borderRadius: 6,
        alignItems: `center`,
        width: `50%`
    },
    optionLabel: {
        color: `#efefef`,
        fontSize: 12,
        marginTop: 20
    }
})