import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { Link } from '../components'
import firestore from '@react-native-firebase/firestore';

export const Home = () => {

    const linksCollection = firestore().collection('links');

    const [link, setLink] = useState('');
    const [customSlug, setCustomSlug] = useState('');
    const [customSlugError, setCustomSlugError] = useState(false);
    const [savedLinks, setSavedLinks] = useState('');
    const [usedSlugs, setUsedSlugs] = useState([]);
    const [loading, setLoading] = useState(false);

    const shortenUrl = async () => {
        setLoading(true);
        let id = '';
        if (customSlug && !usedSlugs.includes(customSlug)) {
            id = customSlug;
        } else if (customSlug) {
            // slug is taken
            setCustomSlugError(true);
            setLoading(false);
            return;
        } else {
            id = generateId();
        }

        linksCollection
            .doc(id)
            .set({
                url: link,
                slug: id,
                timestamp: Date.now()
            })
            .then((d) => {
                console.log('done', d);
                setLoading(false);
            })
    }

    const generateId = () => {
        let id = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 4; i++) {
            id += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        if (usedSlugs.includes(id)) {
            generateId();
        } else {
            return id;
        }        
    }

    const setLinks = (d) => {
        d._docs && setSavedLinks(d._docs);

        let retreivedSlugs = [];

        d._docs.forEach((i) => {
            retreivedSlugs.push(i._data.slug);
        });
        setUsedSlugs(retreivedSlugs);
    }

    const onError = (e) => {
        console.log('error retrieving links', e);
    }

    const deleteLink = (slug) => {
        linksCollection
            .doc(slug)
            .delete()
            .then(() => console.log('deleted this link', slug))
    }

    useEffect(() => {
        const linksListener = linksCollection.orderBy('timestamp', 'desc').onSnapshot(setLinks, onError);
        return () => {
            linksListener();
        }
    }, [])

    return (
        
        <View style={styles.container}>
            <Text style={styles.title}>URL Shortener</Text>
            <TextInput 
                style={styles.textInput}
                placeholder="Make your links shorter"
                value={link}
                onChangeText={(t) => setLink(t)}
                autoCapitalize="none"
                autoCorrect={false}
                multiline={false}
            />
            <TextInput 
                style={[styles.textInput, styles.customSlugInput]}
                placeholder="custom slug!"
                value={customSlug}
                onChangeText={(t) => (setCustomSlug(t), setCustomSlugError(false))}
                autoCapitalize="none"
                autoCorrect={false}
                multiline={false}
            />
            <View style={styles.errorContainer}>
            { customSlugError &&
                <Text style={styles.customSlugErrorLabel}>This slug has been taken!</Text>
            }
            </View>
            <Pressable 
                style={[styles.button, (loading || customSlugError || !link) && { opacity: 0.5 }]}
                onPress={shortenUrl}
                disabled={loading || customSlugError || !link}
            >
                { loading ?
                    <ActivityIndicator />
                    :
                    <Text>Shorten URL</Text>
                }
                
            </Pressable>
            <FlatList 
                data={savedLinks}
                keyExtractor={(item) => { return item?._data?.slug }}
                renderItem={({item, index}) => {
                    return (
                        <Link 
                            key={item?._data?.slug}
                            url={item?._data?.url}
                            slug={item?._data?.slug}
                            deleteLink={deleteLink}
                        />
                    )
                }}
                ListHeaderComponent={() => <View style={{ height: 40 }} />}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: `100%`,
        backgroundColor: `darkslategrey`,
        paddingVertical: 42
    },
    title: {
        textAlign: `center`,
        color: `#efefef`,
        fontSize: 22,
        fontWeight: `700`
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
    customSlugInput: {
        width: `50%`,
        
    },
    errorContainer: {
        height: 32
    },
    customSlugErrorLabel: {
        marginTop: 12,
        color: `crimson`,
        flex: 1,
        textAlign: `center`
    },
    button: {
        marginTop: 12,
        backgroundColor: `skyblue`,
        height: 42,
        justifyContent: `center`,
        marginHorizontal: 16,
        borderRadius: 6,
        alignItems: `center`
    }
})