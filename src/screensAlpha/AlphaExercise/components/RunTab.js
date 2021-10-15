import React, { useState, useEffect } from 'react';
import { Text,Image,View, StyleSheet, Dimensions, ScrollView } from 'react-native';
//Barn
// import TempoRun from './TempoRun';
// import BasicRun from './BasicRun';
// import CalibRun from './CalibRun';
import AlphaRunMap from './AlphaRunMap';
import RunModePicker from './RunModePicker';
import * as LocationLib from '../../../api/LocationPermissions';
import * as Location from 'expo-location'
import { TouchableOpacity } from 'react-native-gesture-handler';
const {width, height} = Dimensions.get("window")


/**
 * This is a functional component representing the Run Tab on the Exercise page.
 * It contains the TempoRun, BasicRun, CalibrationRun components.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const RunTab = (props) => {
    const [runStatus, setRunStatus] = useState(0);              //Status of activity
    const [mapPositions, setMapPositions] = useState([])
    //GPS Tracking Data
    const [currCoord, setCurrCoord] = useState( {latitude: 1.377621, longitude: 103.805178,} );    //Current coordinate
    const [promise, setPromise] = useState({});                 //For GPS Subscription Promise

    //GPS Perms
    const [permissionsStatus, setPermissionsStatus] = useState(props.permissionsStatus);

    const[gpsMode,setGpsMode]=useState('track');//track, explore

    // // /**
    // //  * Begining UseEffect
    // //  */
    useEffect(() => {     
        setPermissionsStatus(3)
        // getCurrentLocation();
        // subscribePosition();
        //     setRunStatus(1);  
    } , [])
        
    // /**
    //  * This is a method to check for device's foreground location permission.
    //  */
    const forePermissionHandler = () => {
        LocationLib.forePermissionCheck(() => {
            setPermissionsStatus(1);
        })
    } 

    // /**
    //  * This is a method to check for device's background location permission.
    //  */
    const backPermissionHandler = () => {
        LocationLib.backPermissionCheck(() => {
            setPermissionsStatus(2);
        })
    } 

    // /**
    //  * This is a render effect based on "permissionsStatus" state.
    //  */
    useEffect(() => {
        if (permissionsStatus === 0) {
            console.log ('P_Status : 0 - FOREGROUND:not granted / BACKGROUND:not granted')
            forePermissionHandler()
        }
        if (permissionsStatus === 1) {
            console.log ('P_Status : 1 - FOREGROUND:granted / BACKGROUND:not granted')
            backPermissionHandler()
        }
        if (permissionsStatus === 2) {
            console.log ('P_Status : 2 - FOREGROUND:granted / BACKGROUND:granted')
            getCurrentLocation();
            subscribePosition();
        }
        if (permissionsStatus === 3) {
            setPermissionsStatus(0)
            console.log('P_Status : 3 - App Start')
            // getCurrentLocation();
            setRunStatus(1);
        }
    }, [permissionsStatus])

    

    /* [Get current location] */
    /**
     * This is a method to obtain the user's current location for starting purposes
     */
     const getCurrentLocation = async() => {
        try {
            const { coords: {latitude, longitude} } = await Location.getCurrentPositionAsync()

            console.log('Getting current Location')
            //setPositions( [{latitude: latitude, longitude: longitude}] );
            setCurrCoord( {latitude: latitude, longitude: longitude} );
            props.setCurrCoord( {latitude: latitude, longitude: longitude} );
        } catch (error) {
            console.log(error)
        }
    }

    /* [ON GPS Subscription/Tracking] */
    /**
     * This method subscribes to the device's GPS location over a constant interval.
     */
     const subscribePosition = async() => {
        const options = {accuracy: 6,  timeInterval: 1000, distanceInterval: 1};

        if ( Location.hasServicesEnabledAsync() ){
            try {
                setPromise( await Location.watchPositionAsync( options, onPositionChange) )
                console.log('GPS Tracking on')
            } catch (error) {
                console.log(error);
                console.log('GPS Tracking NOOOOOOOT on')
            }
        }
    }
    /* [OFF GPS Subscription/Tracking] */
    /**
     * This method unsubscribes to the device's GPS location.
     */
     const unsubscribePosition = () => {
        promise.remove()
        console.log('GPS Tracking off')
    }


    /* [Callback function for subscription update] */
    /**
     * This method stores the current location as coordinate Object (latitude & longitude) into an array.
     * @param {Object} locationObj Refer to link: https://docs.expo.dev/versions/v41.0.0/sdk/location/#locationobject
     */
     const onPositionChange = (locationObj) => {
        /* Current position from Update */
        const currLat = locationObj.coords.latitude
        const currLong = locationObj.coords.longitude
        const currPos = {latitude: currLat, longitude: currLong}

        //setPositions((prev) => [...prev , currPos]);
        setCurrCoord(currPos);
        props.setCurrCoord( currPos );
    }



    return (
        <ScrollView 
            style={styles.contentContainer}
            contentContainerStyle={{height: height * 0.73, justifyContent: 'space-around'}}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
        >
            {(permissionsStatus==2)? 

            <View style={styles.contentContainer}>
                <AlphaRunMap
                    runStatus={runStatus}
                    mapPositions={mapPositions} 
                    currCoord={currCoord}
                    gpsMode={gpsMode}
                    setGpsMode={(gpsMode)=>{setGpsMode(gpsMode)}}
                    parkList={props.parkList}

                    navToCoord={props.navToCoord}
                    setNavToCoord={(navToCoord)=>{props.setNavToCoord(navToCoord)}}
                />
                <RunModePicker/>
                <View style={styles.startButton}>
                    <TouchableOpacity>
                        <Text style={styles.startButtonColor}>Start</Text>
                    </TouchableOpacity>
                </View>
                <View style={{...styles.mapMode, width: (gpsMode=="track")?80:100,}}>
                    <TouchableOpacity onPress={()=>{
                        if (gpsMode=='track'){
                            setGpsMode('explore');
                        }   
                        else{
                            setGpsMode('track');
                        }
                    }}>
                        <View style={{...styles.mapModeContainer, width: (gpsMode=="track")?80:100,}}>
                            {(gpsMode=='track')?
                                <Image 
                                    source={require('../../../assets/icons/ExercisePlay.png')}
                                    resizeMode= 'contain'
                                    style={styles.mapModetIcon}
                                />
                                :
                                <Image 
                                    source={require('../../../assets/icons/RunTabSpaceType.png')}
                                    resizeMode= 'contain'
                                    style={styles.mapModetIcon}
                                />
                            }
                            <Text>{gpsMode}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            
            :
            <TouchableOpacity 
            style={styles.contentContainer}
            onPress={()=>{setPermissionsStatus(3)}}>
                <Image 
                source={require('../../../assets/icons/NoGPS.png')}
                resizeMode= 'contain'
                style={styles.contentContainer}
            />
            </TouchableOpacity>
            
            }
           
            {/* <TempoRun/>
            <BasicRun/>
            <CalibRun/> */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contentContainer:{
        width: width,
        height: height * 0.73,
        backgroundColor: '#282B30',
        //backgroundColor: 'yellow',
        elevation:5,
        shadowOffset: {
            width: 20,
            height: -20
          },
        shadowOpacity:0.9,
        shadowRadius:10,
        shadowColor:'black'
        
    }, 
    startButton:{
        width: width*0.95,
        height: height * 0.09,
        alignItems:'center',
        justifyContent:'center',
        position: 'absolute', 
        top: height * 0.6, 
        left: width * 0.025,
        // zIndex: 2,
        //elevation: 1,
        //backgroundColor: 'red',
        //backgroundColor: '#7289D9',
        borderRadius: height * 0.8,
    }, 
    startButtonColor:{
        width: width*0.95,
        height: height * 0.08,
        //backgroundColor:'red',
        textAlign:'center',
        fontWeight: 'bold',
        fontSize: 18,
        color:'white',
        borderRadius:height * 0.8,
        paddingTop:height * 0.1*0.1,
        //alignSelf:'center'
        backgroundColor: '#7289D9',
    } ,
    mapMode:{
        
        //height: height * 0.1,
        height: 25,

        //aspectRatio: 1,
        borderRadius: 25,
        position: 'absolute',
        //right: ((width * 0.95) - (width * 0.65) - (height * 0.1)) * 0.5,
        //top: height * (0.4-0.1), 
        right: (width * 0.025),
        top: height * (0.4)-25-10, 
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#BABBBF',
        //backgroundColor: 'rgba(186,187,191,0.5)',//grey
        backgroundColor:'rgba(114,137,217,0.5)',//blue
        },
    mapModeContainer:{
        
        //height: height * 0.1,
        height: 25,

        //aspectRatio: 1,
        borderRadius: 25,
        //top: height * (0.4-0.1), 
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection:'row',
        //backgroundColor: '#BABBBF',
        //backgroundColor: 'rgba(186,187,191,0.5)',//grey
        backgroundColor:'rgba(114,137,217,0.5)',//blue
        },
    mapModetIcon:{
            //height: height * 0.05,
            height: 15,
            width: 15,
            marginLeft:10,
            //aspectRatio: 1,
            transform: [{translateX: width * -0.003}],
            tintColor: 'rgba(79,83,92,0.5)',
            //backgroundColor:'pink'
        },
    
    
    
})

export default RunTab;

// import React, { useState, useEffect } from 'react';
// import { SafeAreaView,View, StyleSheet, Dimensions, ScrollView } from 'react-native';
// //Barn
// // import TempoRun from './TempoRun';
// // import BasicRun from './BasicRun';
// // import CalibRun from './CalibRun';
// import AlphaRunMap from './AlphaRunMap';
// const {width, height} = Dimensions.get("window")


// /**
//  * This is a functional component representing the Run Tab on the Exercise page.
//  * It contains the TempoRun, BasicRun, CalibrationRun components.
//  * 
//  * @author NTU CZ2006 Team Alpha
//  */
// const RunTab = () => {
//     const [runStatus, setRunStatus] = useState(0);              //Status of activity
//     const [mapPositions, setMapPositions] = useState([])
//     //GPS Tracking Data
//     const [startCoord, setStartCoord] = useState( {latitude: 1.377621, longitude: 103.805178,} );   //Initial coordinate
//     const [currCoord, setCurrCoord] = useState(startCoord);     //Current coordinate


//     return (
        
//         <ScrollView 
//             style={styles.contentContainer}
//             contentContainerStyle={{height: height * 0.73, justifyContent: 'space-around'}}
//             decelerationRate="fast"
//             showsVerticalScrollIndicator={false}
//             bounces={false}
//             overScrollMode="never"
//         >
//             <SafeAreaView style={styles.contentContainer}>
//                 {/* Map */}
//                 <View style={styles.mapContainer}>
//                     <AlphaRunMap
//                         runStatus={runStatus}
//                         mapPositions={mapPositions} 
//                         currCoord={currCoord}
//                     />
//                 </View>

//             </SafeAreaView>
//             {/* <TempoRun/>
//             <BasicRun/>
//             <CalibRun/> */}
//         </ScrollView>
//     ); 
// };

// const styles = StyleSheet.create({
//     contentContainer:{
//         width: width,
//         height: height * 0.73,
//         backgroundColor: '#282B30',
//     },      

// })

// export default RunTab;