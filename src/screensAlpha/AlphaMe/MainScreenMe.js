import React from 'react';
import {  SafeAreaView,  StyleSheet,  Text,  View, Dimensions } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
const {width, height} = Dimensions.get("window")
import { Button } from 'react-native-paper';
/**
 * This is a functional component representing the main styling screen throughout the application.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const MeScreen = (props) => {

  return (
    <SafeAreaView style={styles.screen}>
                <View>
                    {props.children}
                </View>
        <View style={styles.navigationBar}/>
        
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    screen:{
        width: width,
        height: height,
        backgroundColor: '#282b30',
    },
    navigationBar:{
        width: width,
        height: height * 0.1,
        backgroundColor: '#18191D',
        bottom: 0,
        position: 'absolute',
    },
    ButtonContainer: {
        flexDirection:"row",
    },
})

export default MeScreen;
