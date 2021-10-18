import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet,  Text,  View, Dimensions, Animated, TouchableWithoutFeedback } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { auth as SpotifyAuth,  remote as SpotifyRemote } from 'react-native-spotify-remote';
import { Button } from 'react-native-paper';
import { CommonActions } from "@react-navigation/native";
import * as Authentication from "../../api/auth";
import * as Firestore from '../../api/firestore';
import Screen from './MainScreenMe';
//import components

import GlobalProfileInfo from './component/GlobalProfileInfo';
import PrivateProfileInfo from './component/PrivateProfileInfo';
const {width, height} = Dimensions.get("window")


/**
 * This is a functional component representing the ME screen.
 * 
 * @author NTU CZ2006 Team Alpha
 */

const AlphaMeScreen = ({navigation}) => {
    const [userData, setUserData] = useState({
        height: 0,
        birthday: ",",
        totalDistance: 0,
        runCount: 0,
        longestDistance: 0,
        fastestPace: 0,
        strideDistance: 0,
        joinDate: ","
    });

    /**
     * This is a render effect triggered on component mount.
     */
    useEffect(() => {
        Firestore.db_getUserDataSnapshot(
            (userData) => { setUserData(userData) },
            (error) => {console.log(error)},
        )
    }, [])

    const [isLogoutLoading, setIsLogoutLoading] = useState(false);

    /**
     * This method handles the logout function of Firebase Authentication and navigates the user to Login Screen upon success.
     */
    const handleLogout = () => {
        setIsLogoutLoading(true);
        Authentication.signOut(() => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{name: 'LoginScreen'}],
            }),);
        }, console.error);
    };

    return (
        <Screen title={"Me"}>
            <View>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>Me </Text>
                </View>
                {/*Button*/}
                <View>
                <View style={styles.ButtonContainer}>
                {/* Edit Profile */}
                <View style ={{flex: 1 , borderWidth: 5}}>
                <Button
                    mode="outlined"
                    style={{height: height * (0.15 / 2) * 0.95,backgroundColor: '#424549', borderWidth:2,borderRadius: 9, borderColor: '#7289DA' }}
                    contentStyle={{ paddingVertical: 5 }}
                    icon="pencil"
                    onPress={() => {navigation.navigate("AlphaEditMeScreen", {userData: userData});}}
                    theme={{ dark: true, colors: { primary: '#7289DA', underlineColor:'transparent',} }}>
                    <Text style={{color: '#FFFFFF'}}>Edit Profile</Text>
                </Button>
                </View>

                <View style = {{flex: 1 ,borderWidth: 5, bordercolor: 'grey'}} >
                {/* Logout button */}
                <Button
                    mode="contained"
                    style={{ height: height * (0.15 / 2) * 0.95,borderRadius: 10}}
                    contentStyle={{paddingVertical: 5 }}
                    onPress={handleLogout}
                    loading={isLogoutLoading}
                    disabled={isLogoutLoading}
                    theme={{ dark: true, colors: {primary: '#7289DA', underlineColor: 'transparent'}, }}>
                    <Text style={{color: '#FFFFFF'}}>Log Out</Text>
                </Button>
                </View>
                </View>

                </View>
            </View>

            <ScrollView style = {styles.screenScroll}>
                <View style={styles.contentContainer}>
                    {/* User Global Info */}
                    {/* Profile Picture display*/}
                    <View style={styles.globalInfoContainer}>
                        <GlobalProfileInfo
                            userData={userData}
                        />
                    </View>
                    
                    <View >
                        {/* User Private Info */}
                        <View>
                            <PrivateProfileInfo userData={userData}/>

                        </View>
                    </View>
                </View>
                
            </ScrollView>
            
            
        </Screen>
    );
};

const styles = StyleSheet.create({
    header:{
        width: width,
        height: height * 0.1,
        justifyContent:'center',
        paddingHorizontal: '10%',
        backgroundColor: '#1e2124',
    },
    globalInfoContainer:{
        width: width,
        height: height * 0.20,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#36393E',
    },
    contentContainer:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    ButtonContainer: {
        flexDirection:"row",
    },
    headerText:{
        color: '#BABBBF',
        fontSize: 28,
        fontWeight: 'bold',
        height: height * 0.1,
        includeFontPadding: false,
        textAlignVertical: 'center',
        flex:1
    },
    tabIndicator:{
        width: width,
        // height: height * 0.07,
        backgroundColor: '#1e2124',
        overflow: 'hidden',
    },
    tab:{
        width: width * 0.5,
        // height: height * 0.07,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    tabText:{
        fontWeight: 'bold',
        fontSize: 16,
        color: '#BABBBF',
    },
    tabHighlight:{
        width: height * 0.02,
        height: height * 0.02,
        borderRadius: height,
        position: 'absolute',
        alignSelf: 'center',
        transform: [{translateY: -(height * 0.01) }]
    },
    screenScroll:{
        // backgroundColor: 'green',
        height: height * 0.70,
    }
})

export default AlphaMeScreen;