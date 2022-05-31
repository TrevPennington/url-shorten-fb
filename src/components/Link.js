import React from 'react';
import { View, Text, StyleSheet, Pressable, Share } from 'react-native';

export const Link = ({ url, slug, deleteLink }) => {

    const host = `hw.io/`

    const shareLink = async () => {
        try {
            const result = await Share.share({
                message: host + slug
            })

            if (result.action === Share.sharedAction) {
                console.log('success');
            }

        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <View style={styles.linkContainer}>
            <View style={styles.metaContainer}>
                <Text style={styles.slug}>{host + slug}</Text>
                <Text>{url}</Text>
            </View>
            <View style={styles.optionsContainer}>
                <Pressable 
                    style={styles.copyButton}
                    onPress={shareLink}
                >
                    <Text style={styles.copyText}>
                        share
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => deleteLink(slug)}
                >
                    <Text style={styles.deleteText}>
                        delete
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    linkContainer: {
        backgroundColor: `#efefef`,
        borderRadius: 6,
        marginHorizontal: 20,
        padding: 10,
        flexDirection: `row`
    },
    metaContainer: {
        flex: 1,
        justifyContent: `center`
    },
    slug: {
        fontWeight: `700`,
        fontSize: 16
    },
    optionsContainer: {
        justifyContent: `center`
    },
    copyButton: {
        backgroundColor: `darkslategrey`,
        padding: 5,
        borderRadius: 6
    },
    copyText: {
        color: `#efefef`,
        fontSize: 12,
        fontWeight: `600`
    },
    deleteText: {
        marginTop: 8,
        fontSize: 12,
        textAlign: `center`,
        color: `crimson`,
        opacity: 0.5
    }
})