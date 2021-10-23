import React, { useState, useEffect,useRef } from 'react';
import { Text,Image,View, StyleSheet, Dimensions, ScrollView,FlatList, Alert } from 'react-native';
//Barn
// import TempoRun from './TempoRun';
// import BasicRun from './BasicRun';
// import CalibRun from './CalibRun';
import AlphaRunMap from './AlphaRunMap';
import RunModePicker from './RunModePicker';
import * as LocationLib from '../../../api/LocationPermissions';
import * as Location from 'expo-location'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'; 
import FriendItem from './FriendInviteItem';
import * as Firestore from '../../../api/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Animated,{
    useSharedValue,
    useAnimatedStyle, 
    interpolate,
    withTiming,
} from 'react-native-reanimated';
const {width, height} = Dimensions.get("window")


/**
 * This is a functional component representing the Run Tab on the Exercise page.
 * It contains the TempoRun, BasicRun, CalibrationRun components.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const RunTab = (props) => {
    const translation=useSharedValue(0);
    const navigation = useNavigation();
    const [runStatus, setRunStatus] = useState(0);              //Status of activity
    const [mapPositions, setMapPositions] = useState([])
    //GPS Tracking Data
    const [currCoord, setCurrCoord] = useState( {latitude: 1.377621, longitude: 103.805178,} );    //Current coordinate
    const [promise, setPromise] = useState({});                 //For GPS Subscription Promise

    //GPS Perms
    const [permissionsStatus, setPermissionsStatus] = useState(props.permissionsStatus);

    const[gpsMode,setGpsMode]=useState('track');//track, explore

    const parkList=props.parkList;

    const navToCoord=props.navToCoord;
    const setNavToCoord=props.setNavToCoord;

    
    const activityList=props.activityList;
    const activityListIdx=props.activityListIdx;
    const setActivityListIdx=props.setActivityListIdx;

    const typeList=props.typeList;
    const typeListIdx=props.typeListIdx;
    const setTypeListIdx=props.setTypeListIdx;

    const musicList=props.musicList;
    const musicListIdx=props.musicListIdx;
    const setMusicListIdx=props.setMusicListIdx;

    const audioList=props.audioList;
    const audioListIdx=props.audioListIdx;
    const setAudioListIdx=props.setAudioListIdx;

    const polygonUserIsIn=props.polygonUserIsIn;
    const polygonUserIsInName=props.polygonUserIsInName;

    //For Game Invite
    const [friendList , setFriendList] = useState([]);
    const [empty, setEmpty]= useState(true);
    const [gameInviteList,setGameInviteList]=useState([]);
    const [oragniserDisplayPicture, setOragniserDisplayPicture] = useState({uri:"https://images.unsplash.com/photo-1474978528675-4a50a4508dc3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHByb2ZpbGV8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"})
    const [organiserDisplayName, setOrganiserDisplayName] = useState('');
    const [organiserUserData, setOrganiserUserData] = useState({});

    // // /**
    // //  * Begining UseEffect
    // //  */
    useEffect(() => {     
        setPermissionsStatus(3)
        // getCurrentLocation();
        // subscribePosition();
        //     setRunStatus(1);  

        Firestore.db_friendsList(
            (userList) => {
                setFriendList(userList)
                console.log(userList)
                // console.log(userList)
            },
            (error) => {console.log(error)},
        )

        //A subscribes to any changes on the database
        Firestore.db_gameRequestListonSnapshot(
            (userList) => {
                if (userList.length == 0) {
                    
                    setEmpty(true);
                } else {
                    // translation.value=withTiming(width * 0.425,{
                    //     duration:400
                    // });
                    setEmpty(false);
                    setGameInviteList(userList)
                }  
            },
            (error) => {console.log(error)},
        )
        

        

    } , [])

    useEffect(() => {

        
        if(gameInviteList.length!=0){
            console.log("#########################################################################################"+gameInviteList[0].creator)
            Firestore.db_getOtherDataSnapshot(
                gameInviteList[0].creator,
                (userData) => {
                    setOrganiserUserData(userData)
                    setOrganiserDisplayName(userData.displayName)
                    // console.log(userData)
                },
                (error) => {console.log(error)},
            );
            Firestore.storage_retrieveOtherProfilePic(gameInviteList[0].creator, setOragniserDisplayPicture, () => {});
        }
        
    }, [gameInviteList])
    


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

    /* 
        Changes by omkar to incorporate the running page.
    */

    const [selectToggle, setSelectToggle] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(0);
    
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

    
    //const [toggleIN, settoggleIN] = useState(0);
    const animatedStyle=useAnimatedStyle(()=>{
        return{
            opacity:interpolate(
                translation.value,
                [-width*0.4,width * 0.425],
                [0,0.8]
            ),
            transform:[
                {
                    translateX:translation.value,

                },
//                 {
//                     scale:interpolate(
//                         translation.value,
//                         [0,100],
//                         [0.5,1])
// ,
//                 }
            ],
        };
    });
    useEffect(() => {
        //console.log("RunModePicker "+typeListIdx+typeList.findIndex((item)=>{return item.name ==='TIME'})+" "+typeList[typeListIdx].name)
        //console.log("Empty:"+empty+"type:"+ (typeListIdx==typeList.findIndex((item)=>{return item.name ==='TIME'})))
        console.log("Empty:"+empty+"type:"+typeList[typeListIdx].name+ (typeList[typeListIdx].name==='TIME')+"#################################################" )
        if(!empty && (typeList[typeListIdx].name==='TIME')){
            console.log("Entered")

            translation.value=withTiming(width * 0.425,{
                duration:400
            });
        }else {
            translation.value=withTiming(0,{
                duration:400
            });
        }
        
    }, [empty, typeListIdx,organiserUserData])

    const decline=()=>{
        if (organiserUserData!=null){
            Firestore.db_declineRequestFriendtoGame( organiserUserData.uid);
        }
        
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
                    parkList={parkList}

                    navToCoord={navToCoord}
                    setNavToCoord={(navToCoord)=>{setNavToCoord(navToCoord)}}

                    typeList={typeList}
                    typeListIdx={typeListIdx}
                    setTypeListIdx={(listIdx)=>setTypeListIdx(listIdx)}
                />
                <RunModePicker
                    activityList={activityList}
                    activityListIdx={activityListIdx}
                    setActivityListIdx={(listIdx)=>setActivityListIdx(listIdx)}
                    
                    typeList={typeList}
                    typeListIdx={typeListIdx}
                    setTypeListIdx={(listIdx)=>setTypeListIdx(listIdx)}
                    
                    musicList={musicList}
                    musicListIdx={musicListIdx}
                    setMusicListIdx={(listIdx)=>setMusicListIdx(listIdx)}
                    
                    audioList={audioList}
                    audioListIdx={audioListIdx}
                    setAudioListIdx={(listIdx)=>setAudioListIdx(listIdx)}
                
                />
                <View style={styles.startButton}>
                    <TouchableOpacity onPress={() => {
                        setStatus(6);
                        console.log("STARTEDDDDD "+ typeList[typeListIdx].name)
                        // Checking length of the polygon list
                        console.log("length:" + polygonUserIsIn.length)
                        if(typeList[typeListIdx].name=='SPACE' && polygonUserIsIn.length === 0){
                            Alert.alert(
                                "Not in a designated running area!",
                                "Space racing requires you to be in a recognized running zone. To see the zones near you, head over to the workout tab!",
                                [ { text:"Understood", onPress: () => {console.log("Alert closed")} } ]
                            )
                        }
                        else if (typeList[typeListIdx].name=='SPACE' && polygonUserIsIn.length > 0){
                            navigation.navigate("AlphaSpaceRace", {mode: "Space", polygonUserIsIn: polygonUserIsIn, polygonUserIsInName: polygonUserIsInName})
                        }else if(typeList[typeListIdx].name=='TIME'){
                            navigation.navigate("LobbyOrganiserScreen",{mode: "Time", chooseState:true})
                        } 
                    }}>
                        <Text style={{...styles.startButtonColor,backgroundColor:(typeList[typeListIdx].name=='SPACE' && polygonUserIsIn.length === 0)?"grey":'#7289D9'}}>Start</Text>
                    </TouchableOpacity>
                </View>

                <Animated.View style={[{
                position: 'absolute', 
                width: width*0.4, 
                height: height * 0.2, 
                alignItems:'center', 
                justifyContent:'center',        
                left: (width * 0.025) -(width * 0.025)-width*0.4,
                top: height * (0.4-0.2)-10, 
                //backgroundColor:'pink' ,
                
                },animatedStyle]}>
                    {/* <FlatList
                        showsVerticalScrollIndicator ={false}
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        numColumns={1}
                        data={friendList }
                        keyExtractor={item => item.uid}
                        renderItem={({item}) => <FriendItem item={item}/>}
                        ListEmptyComponent={
                            <View style={styles.emptyList}>
                                <View style={styles.emptyIcon}>
                                    <FontAwesome name="search" size={height * 0.04} color="#72767D"/>
                                </View> 
                                <Text style={styles.emptyText}>Search for Users by</Text>
                                <Text style={styles.emptyText}>Name or ID</Text>
                            </View>
                        }
                    /> */}
                    <View style={{width: width*0.4, height: height * 0.2, backgroundColor:'rgba(28, 34, 34, 1)',borderRadius:15,alignItems:'center',justifyContent:'space-evenly',overflow:'hidden'}}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.nameText} numberOfLines={1}>Time Racing</Text>
                        </View>
                        {/* profile image */}
                        <View style={{...styles.pictureContainer  }}>
                            { (oragniserDisplayPicture.uri != "") &&
                                <Image style={styles.pictureContainer} source={oragniserDisplayPicture} />
                            }
                        </View>
                        {/* Display name */}
                        <View style={styles.nameContainer}>
                            <Text style={styles.nameText} numberOfLines={1}>{(organiserDisplayName.length>6)?(organiserDisplayName.slice(0,6)+"..."):(organiserDisplayName)}</Text>
                        </View>
                        {/* Accept Decline Button */}
                        <View style={{height: height*0.06,width: width*0.4,justifyContent:'space-evenly',alignItems:'center',backgroundColor:"green",flexDirection:'row'}}>
                            <TouchableOpacity style={styles.button} onPress={() => {
                                    if(gameInviteList.length!=0){
                                        navigation.navigate("LobbyParticipantScreen",{mode: "Time", chooseState:false, gameInviteData:gameInviteList[0]})
                                    }
                                }}>
                                <Image 
                                    source={require('../../../assets/icons/RunTabAcceptButton.png')}
                                    resizeMode= 'contain'
                                    style={{...styles.buttonIcon,tintColor:'green'}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => decline()}>
                                <Image 
                                    source={require('../../../assets/icons/RunTabDeclineButton.png')}
                                    resizeMode= 'contain'
                                    style={{...styles.buttonIcon,tintColor:'red'}}
                                />
                            </TouchableOpacity>   
                        </View>

                    </View>
                
                </Animated.View>
                
                <View style={{...styles.mapMode, width: (gpsMode=="track")?80:100,}}>
                    <TouchableOpacity onPress={()=>{
                        if (gpsMode=='track'){
                            setGpsMode('explore');
                        }   
                        else{
                            setGpsMode('track');
                        }
                        // if(toggleIN==1){
                        //     settoggleIN(0)
                        // }else{
                        //     settoggleIN(1)
                        // }
                        
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
    button:{
            height: height * 0.05,
            aspectRatio: 1,
            borderRadius: height,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#7289DA',
            overflow:'hidden',
        },
    buttonIcon:{
            // height: height * 0.05,
            // aspectRatio: 1,
            height: height * 0.05,
            borderRadius: height,
            tintColor: '#BABBBF',
            resizeMode:'contain'
        },
    pictureContainer:{
            height: height * 0.1,
            aspectRatio: 1,
            borderRadius: height,
            backgroundColor: '#4F535C',
        },
    
    nameContainer:{
            height: height * 0.02,
            width: height * 0.12,
            //justifyContent: 'center',
            //backgroundColor: 'purple',
        },
    nameText:{
            height: height * 0.02,
            fontWeight: 'bold',
            fontSize: 12,
            color: '#FFFFFF',
            //backgroundColor:'blue',
            textAlign:'center',
    
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