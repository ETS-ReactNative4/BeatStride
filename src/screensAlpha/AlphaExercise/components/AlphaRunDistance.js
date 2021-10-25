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
        <View >
            <Text numberOfLines={1} style={{...styles.distanceDisplay,textAlign:'center',textAlignVertical:'center',}}>{(distance / 1000).toFixed(2)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    distanceDisplay: {
        textAlign: 'center',
        fontSize: 80,
        color: 'white',
        //backgroundColor:'yellow',
        height:height*0.17,
        textAlign:'center',
        textAlignVertical:'center',
    },
    componentContainer:{
        height: height * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text:{
        fontSize: 0.03*height,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    subtext:{
        fontSize: 0.0175*height,
        color: '#BABBBF',
    },
})

export default AlphaRunDistance;
