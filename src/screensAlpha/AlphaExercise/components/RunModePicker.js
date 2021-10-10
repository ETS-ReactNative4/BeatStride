import React, { useState, useEffect } from 'react';
import { Text,Image,View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import * as Location from 'expo-location';
// import PlaylistSelectionBasic from '../PlaylistSelectionBasic';
// import SelectLoading from './SelectLoading';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RumModePickerItem from './RumModePickerItem'
const {width, height} = Dimensions.get("window")

/**
 * This is a functional component representing the Basic run on Run Tab on the Exercise page.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const RunModePicker = () => {

    const [selectToggle, setSelectToggle] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(0);
    
    var tile=['Activity','Type','Music','Audio Stats']
    //Runmode picker
    const[activity,setActivity]=useState("Running");
    const[activityType,setActivityType]=useState("Time");
    const[music,setMusic]=useState("Spotify");
    const[audio,setAudio]=useState("1KM");

    const[activityPNG,setActivityPNG]=useState(require('../../../assets/icons/RunTabRunActivity.png'));
    const[activityTypePNG,setActivityTypePNG]=useState(require('../../../assets/icons/RunTabSpaceType.png'));
    const[musicPNG,setMusicPNG]=useState(require('../../../assets/icons/RunTabMusic.png'));
    const[audioPNG,setAudioPNG]=useState(require('../../../assets/icons/RunTabAudioStats.png'));
    /**
     * This is a method to check the status of device's location service.
     */
    const seviceCheck = async() => {
        const check = await Location.hasServicesEnabledAsync()
        // console.log(check)
        if (check) {
            setStatus(1);
        } else {
            try {
                const pos = await Location.getCurrentPositionAsync();
                if (pos) {
                    setStatus(1);
                }
            } catch(error) {
                console.log(error);
                Alert.alert(
                    "GPS Location Service",
                    "Run function requires GPS Location Service enabled. Please enable GPS Location Service and try again.",
                    [ { text:"Understood", onPress: () => {console.log("Alert closed")} } ]
                )
                setStatus(0);
            }
        }
    }

    /**
     * This is a render effect based on "status" state.
     */
    useEffect(() => {
        if (status === 1) {
            console.log("GPS Enabled")
            setSelectToggle(true);
        }
        if (status === 6) {
            console.log("Checking GPS Service")
            seviceCheck();
        }
    },[status])

    return (
        <View style={styles.componentContainer}>
            
            {/* <Text>Centered View</Text> */}
            {/* Start Button */}
            <View style={{justifyContent: 'space-between', width: width * 0.95, height: height * 0.2,} }>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: width * 0.95, height: height * 0.1-1,overflow:'hidden',}}>
                        <RumModePickerItem title={tile[0]} discription={activity} imagePNG={activityPNG} />
                        <RumModePickerItem title={tile[1]} discription={activityType} imagePNG={activityTypePNG}/>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: width * 0.95, height: height * 0.1-1,overflow:'hidden',}}>
                        <RumModePickerItem title={tile[2]} discription={music} imagePNG={musicPNG}/>
                        <RumModePickerItem title={tile[3]} discription={audio} imagePNG={audioPNG}/>
                    </View>

            </View>
                
           

            {/* Playlist Selection Popup */}
            {/* <PlaylistSelectionBasic
                selectToggle={selectToggle}
                setSelectToggle={setSelectToggle}
                mode={"Basic"}
                setIsLoading={setIsLoading}
            /> */}

            {/* Loading Modal */}
            {/* <SelectLoading
                isLoading={isLoading}
            />   */}
        </View>

    );
};

const styles = StyleSheet.create({
    componentContainer:{
        position: 'absolute', 
        top: height * 0.4, 
        left: width * 0.025 ,
        justifyContent: 'space-between', 
        //backgroundColor:'#4F535C',
        backgroundColor:'#bfbfbf',
        //backgroundColor: '#424549', 
        zIndex: 2,
        flexDirection:'row',
        width: width * 0.95,
        height: height * 0.2, 
        borderRadius:10,
        borderWidth: 0,
        overflow:'hidden',
    }, 
    startButton:{
        width: width*0.95,
        height: height * 0.8,
        position: 'absolute', 
        top: height * 0.2, 
        left: width * 0.025,
        zIndex: 1,
        elevation: 3,
        backgroundColor: 'red',
        borderRadius: height * 0.8,
    }, 
    startButtonColor:{
        //backgroundColor: '#7289D9',
    }
    
})

export default RunModePicker;
