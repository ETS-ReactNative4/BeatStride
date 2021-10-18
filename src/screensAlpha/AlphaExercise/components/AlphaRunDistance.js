import React from 'react';
import { StyleSheet,  Text,  View, Dimensions } from 'react-native';

const {width, height} = Dimensions.get("window")


/**
 * This is a functional component representing the Distance display during a run.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const AlphaRunDistance = (props) => {
    const distance = props.distance

    return (
        <View style={styles.distanceDisplay}>
            <Text numberOfLines={1} style={styles.distanceDisplay}>{(distance / 1000).toFixed(2)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    distanceDisplay: {
        textAlign: 'center',
        fontSize: 100,
        color: 'white'
    },
    componentContainer:{
        height: height * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    subtext:{
        fontSize: 14,
        color: '#BABBBF',
    },
})

export default AlphaRunDistance;
