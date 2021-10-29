import React, {Component} from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert, TouchableOpacity,Animated,ScrollView} from 'react-native';


import { useState, useEffect,useRef } from 'react';
import {  Dimensions, Image} from 'react-native';
import { CommonActions } from '@react-navigation/native'; 
import * as Location from 'expo-location';
import * as geolib from 'geolib';
import moment from 'moment';
import TTS from 'react-native-tts';
import { useSelector } from 'react-redux';
import * as Firestore from '../../api/firestore';

import AlphaRunDistance from './components/AlphaRunDistance';
import AlphaRunTimer from './components/AlphaRunTimer';
import AlphaRunCountdown from './AlphaRunCountdown';
import HoldableButton from './components/CircularProgressBar/HoldableButton';

//Added by Barnabas
import AlphaRunMapTimeRace2 from './AlphaRunMapTimeRace2';
import FriendItemDragTimeRace from './components/FriendItemDragTimeRace';
import FriendItemDragTimeRaceMini from './components/FriendItemDragTimeRaceMini';
//End by Barnabas

const {width, height} = Dimensions.get("window")

const AlphaTimeRace = ({navigation, route}) => {
    //Added by Barnabas
    const [scrollToPage, setScrollToPage]=useState(0);
    /* SCROLL ANIMATIONS */
    const [scrollRef , setScrollRef] = useState(null)

    //End by Barnabas

   

    /* [Page Navigation Render] */
    /**
     * This is an event listener which triggers upon component focus
     */
    const PageTrigger = navigation.addListener( 'focus', () => {
      getCurrentLocation();
      setRunStatus(1);
    } )

  /**
   * This is a render effect which setup an event listenser for the android device's "back" button.
   */
  useEffect(() => {
      const back = navigation.addListener('beforeRemove', (e) => {
          if (runStatus === 2 || runStatus == 3 || runStatus == 8) {
              e.preventDefault();
              setRunStatus(9);
          }
      });
      return back;
  } )
  
  const mode = route.params.mode;

  const [countdown, setCountdown] = useState(true);           //Countdown popup
  const [countdownMsg, setCountdownMsg] = useState("5");      //Countdown message

  const [runStatus, setRunStatus] = useState(0);              //Status of activity
  const [promise, setPromise] = useState({});                 //For GPS Subscription Promise
  
  //GPS Tracking Data
  const [startCoord, setStartCoord] = useState( {latitude: 1.377621, longitude: 103.805178,} );   //Initial coordinate
  const [currCoord, setCurrCoord] = useState(startCoord);     //Current coordinate
  const [positions, setPositions] = useState([startCoord]);   //Array of "valid" positons 
  const [mapPositions, setMapPositions] = useState([])
  const [distance, setDistance] = useState(0);
  const [distance10m, setDistance10m] = useState(0);

  //Additonal (For Speaker)
  const [km, setKm] = useState(0);

  //Compiled Data
  const [duration, setDuration] = useState(0);        //Total Run Duration
  const [steps, setSteps] = useState(0);               //Total Run Steps
  const [timeStart, setTimeStart] = useState('')      //Start Time of Run
  const [day , setDay] = useState('')                 //Start Day of Run
  const [date, setDate] = useState('')                //Start Date of Run


   //Required For Time Racing
   const gameKey = route.params.gameKey;
   const [selfID, setSelfID] = useState('')
   const [friendList , setFriendList] = useState([]);
   const [gameSettings,setGameSettings]= useState({});

   const [runnerPositions, setRunnerPositions]=useState({});
   const [newRunnerPositions, setNewRunnerPositions]=useState({});
   const [oldPosition, setOldPosition]=useState(0);


//    const [endConditionTime,setEndConditionTime] =useState(moment.duration(0));
//    const [endConditionDistance, setEndConditionDistance]=useState(0);

//    const [raceParam,setRaceParam]=useState("");
   useEffect(() => {
       Firestore.db_getUserDataSnapshot(
           (userData) => { 
               if(userData!=null){
                   setSelfID(userData.uid); 
               }
                   
           },
           (error) => { console.log(error) },
       )
       setScrollToPage(1)
   }, [])

   useEffect(() => {
       if(selfID!=''){
           console.log("In Alpha Time Race!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
           console.log("selfID:"+selfID)
           console.log("gameKey:"+gameKey)
           const unsubscribeGameRoomRacingParticipantListonSnapShot=Firestore.db_gameRoomRacingParticipantListonSnapShot(
               gameKey
               ,(userList) => {
                   // var self=userList[userList.findIndex(item => item.uid==selfID)]
                   // var newUserList=[self,...userList.filter( (userData) => {return !(userData.uid === selfID);})]
                   // setFriendList(newUserList)
                   //console.log(userList)
                   // var pos={};
                   // for (var i=0;i<newUserList.length;i++){
                   //     var string=newUserList[i].uid;
                   //     pos[string]=i;
                   // }

                   setFriendList(userList)
                   var pos={};
                   for (var i=0;i<userList.length;i++){
                       var string=userList[i].uid;
                       pos[string]=i;
                   }
                   setRunnerPositions(pos);
                   setNewRunnerPositions(pos);
   
                   //console.log(pos)

               },
               (error) => {console.log(error)},
           ) 

           Firestore.db_gameRoomSettingsGet(
               gameKey
               ,(settings) => {
                   if( settings[0]!=null){
                        // if(settings[0].raceType=='Time'){
                        //    setEndConditionTime( moment.duration(0).add(moment(settings[0].EndConditionTime,'HH:mm:ss').minutes(),'m').add(moment(settings[0].EndConditionTime,'HH:mm:ss').seconds(),'s').add(moment(settings[0].EndConditionTime,'HH:mm:ss').hour(),'h')) 
                        // }else if(settings[0].raceType=='Distance'){
                        //     setEndConditionDistance(settings[0].EndConditionDistance)
                        // }
                        
                        // setRaceParam(settings[0].raceType);
                       // status: status,
                       // creator:uid
                       // gameKey:gameKey ,
                       // raceType:type ,
                       // EndConditionDistance: overallTime,
                       // EndConditionDistance: distance,
                       setGameSettings(settings)
                   }
               },
               (error) => {console.log(error)},
           ) 
       }
       return ()=>{
            console.log("UnSUBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
            if (typeof unsubscribeGameRoomRacingParticipantListonSnapShot !== 'undefined') {
                unsubscribeGameRoomRacingParticipantListonSnapShot();
            }
       }
   }, [selfID])

//    useEffect(() => {
//        console.log("check friendList **************************************************************************")
//        console.log(friendList)

//    }, [friendList])
   useEffect(() => {

        console.log("new Position: "+newRunnerPositions[selfID])
        console.log("old Position: "+oldPosition)
        if(friendList.length!=0&& distance>20){
            if(oldPosition==0){
                setOldPosition(newRunnerPositions[selfID])
            }else if(newRunnerPositions[selfID]>oldPosition){
                TTS.getInitStatus().then(() => {
                    TTS.setDefaultLanguage('en-US');
                    // TTS.setDefaultRate(0.5);
                    TTS.speak('over Taken. New Position '+(newRunnerPositions[selfID]+1));
                });                    
                setOldPosition(newRunnerPositions[selfID])
            }else if(newRunnerPositions[selfID]<oldPosition){
                if(newRunnerPositions[selfID]+1===1){
                    TTS.getInitStatus().then(() => {
                        TTS.setDefaultLanguage('en-US');
                        // TTS.setDefaultRate(0.5);
                        TTS.speak('Taken the Lead');
                    });
                }else{
                    TTS.getInitStatus().then(() => {
                        TTS.setDefaultLanguage('en-US');
                        // TTS.setDefaultRate(0.5);
                        TTS.speak('New Position '+(newRunnerPositions[selfID]+1));
                    });
                }

                setOldPosition(newRunnerPositions[selfID])
            }
        }
   }, [newRunnerPositions])

//    useEffect(() => {
//        console.log("check gameSettings GET**************************************************************************")
//        console.log(gameSettings)
//    }, [gameSettings])

//    useEffect(() => {
//        console.log("check runnerPositions **************************************************************************")
//        console.log(runnerPositions)
//    }, [runnerPositions])

//    useEffect(() => {
//        console.log("check newRunnerPositions **************************************************************************")
//        console.log(newRunnerPositions)
//    }, [newRunnerPositions])

   useEffect(() => {
    //    console.log("DISTANCEEEEEEEEEEE10m!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    //    console.log(distance10m)
    //    console.log(distance)
       if(distance!=0){
           Firestore.db_setMeasurementGameRoom( gameKey, distance10m )
       }
       
   }, [distance10m])


  /*              /
  /   Functions   /
  /              */

  /* [Get current location] */
  /**
   * This is a method to obtain the user's current location for starting purposes
   */
  const getCurrentLocation = async() => {
      try {
          const { coords: {latitude, longitude} } = await Location.getCurrentPositionAsync()

          // console.log('Getting current Location')
          setPositions( [{latitude: latitude, longitude: longitude}] );
          setCurrCoord( {latitude: latitude, longitude: longitude} );

      } catch (error) {
          console.log(error)
      }
  }

  /* [Get current location] */
  /**
   * This is a method to obtain the user's current location for resuming purposes
   */
  const getResumeLocation = async() => {
      try {
          const { coords: {latitude, longitude} } = await Location.getCurrentPositionAsync()
          console.log('Getting current Location')

          setPositions( (prevState) => [...prevState, {latitude: latitude, longitude: longitude}] );
          setCurrCoord( {latitude: latitude, longitude: longitude} );
      } catch (error) {
          console.log(error)
      }
  }

  /* [GPS Subcription countdown] */
  /**
   * This is a method to initiate a countdown to for GPS subscription for starting purposes.
   * This countdown also works as a buffer for the GPS services to start up properly.
   */
  const subcriptionCountdown = () => {
      /* 0 second */
      console.log('Starting in 3');
      getCurrentLocation();
      setCountdownMsg(3);
      setCountdown(true);
      
      /* 1 second */
      setTimeout( () => {
          console.log('Starting in 2');
          setCountdownMsg(2);
          getCurrentLocation();
      }, 1000);
  
      /* 2 second */
      setTimeout( () => {
          console.log('Starting in 1');
          setCountdownMsg(1);
      }, 2000);
  
      /* 3 second */
      setTimeout( () => {
          console.log('Start');
          TTS.getInitStatus().then(() => {
              TTS.setDefaultLanguage('en-US');
              // TTS.setDefaultRate(0.5);
              TTS.speak('Run Started');
          });
          subscribePosition();
          setRunStatus(2);
          setCountdown(false);
      }, 3000);
  }

  /* [GPS Subcription countdown] */
  /**
   * This is a method to initiate a countdown to for GPS subscription for resuming purposes.
   * This countdown also works as a buffer for the GPS services to start up properly.
   */
  const resumeCountdown = () => {
      /* 0 second */
      console.log('Starting in 3');
      setCountdownMsg(3);
      setCountdown(true);
      
      /* 1 second */
      setTimeout( () => {
          console.log('Starting in 2');
          setCountdownMsg(2);
      }, 1000);
  
      /* 2 second */
      setTimeout( () => {
          console.log('Starting in 1');
          setCountdownMsg(1);
          getResumeLocation();
      }, 2000);
  
      /* 3 second */
      setTimeout( () => {
          console.log('Start');
          TTS.getInitStatus().then(() => {
              TTS.setDefaultLanguage('en-US');
              // TTS.setDefaultRate(0.5);
              TTS.speak('Run Resumed');
          });
          
          subscribePosition();
          setRunStatus(2);
          setCountdown(false);
      }, 3000);
  }

  /* [ON GPS Subscription/Tracking] */
  /**
   * This method subscribes to the device's GPS location over a constant interval.
   */
  const subscribePosition = async() => {
      const options = {accuracy: 6,  timeInterval: 500, distanceInterval: 1};

      if ( Location.hasServicesEnabledAsync() ){
          try {
              setPromise( await Location.watchPositionAsync( options, onPositionChange) )
              console.log('GPS Tracking on')
          } catch (error) {
              console.log(error);
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

  /* [Distance Calculator] */
  /**
   * This method calculates the distance between 2 coordinates.
   * @param {Object} prev_Pos A coordinate Object with the following fields: latitude (number) & longitude (number).
   * @param {Object} curr_Pos A coordinate Object with the following fields: latitude (number) & longitude (number).
   * @returns 
   */
  const distanceCalculate = (prev_Pos, curr_Pos) => {
      const distGain = geolib.getDistance (prev_Pos, curr_Pos, 0.1)
      console.log('Distance Gained')
      console.log(distGain)
      return distGain;
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

      setPositions((prev) => [...prev , currPos]);
      setCurrCoord(currPos);
  }
//   const endConditionCheck=()=>{
//       if(raceParam=='Time'){
//         console.log("DURATION: "+moment.utc(duration.as('milliseconds')).format('HH:mm:ss'))
//         if(duration>endConditionTime){
//             TTS.getInitStatus().then(() => {
//                 TTS.setDefaultLanguage('en-US');
//                 // TTS.setDefaultRate(0.5);
//                 TTS.speak('Race Complete, Time:'+endConditionTime.hours()+' hours '+endConditionTime.minutes()+endConditionTime.seconds());
//                 setRunStatus(6);
//             });
//         }
//       }else if(raceParam=='Distance'){
//         console.log("Diatance: "+distance+"endConditionDistance:"+endConditionDistance/100)
//         if(distance>endConditionDistance/100){
//             TTS.getInitStatus().then(() => {
//                 TTS.setDefaultLanguage('en-US');
//                 // TTS.setDefaultRate(0.5);
//                 TTS.speak('Race Complete, Distance: '+Math.floor(endConditionDistance/1000)+' kilometers '+Math.floor(endConditionDistance/100)+'meters');
//                 setRunStatus(6);
//             });
//         }
//       }

//   }
  /* [Position Validation] */
  /**
   * This method checks the distance between the current position & previous position.
   * Only movement within Limit Range would be taken into consideration of position.
   */
  const positionValidation = () => {
      //endConditionCheck();
      let currPos
      let prevPos
      if (positions.length == 1) {
          currPos = positions[0];
          prevPos = positions[0];
      } else {
          currPos = positions[positions.length - 1];
          prevPos = positions[positions.length - 2];
      }     
      // console.log(currPos)
      // console.log(prevPos)

      /* Calculate distance change from position update */
      const distGain = distanceCalculate(prevPos, currPos)

      /* Validation of position update */
      const minGain = 1.5;
      const maxGain= 20;
      if ( (minGain < distGain) && (distGain < maxGain) ) {
          setDistance((prevCurrentDistance) => (Math.round( (prevCurrentDistance + distGain)*100 ))  / 100);
          //Updates Every 50m
          setDistance10m((prevCurrentDistance) => (Math.round( (prevCurrentDistance + distGain)*2 ))  / 2);
        //   push to db here
          setMapPositions((prev) => [...prev, currPos]);
      }
  }

  

  /*                /
  /     Renders     /
  /                */

  /* [Validation of position movement] */
  /**
   * This is a render effect based on "positions" state.
   * This renders after every callback from GPS subscription. It validates movements and update accordingly.
   */
  useEffect(() => {
      if (runStatus == 2 || runStatus == 8 || runStatus == 9) {
          positionValidation();
          // console.log("validating")
      }
  },[positions])

  const [paused , setPaused] = useState(false);
  /* [Run Status Render] */
  /**
   * This is a render effect based on "runStatus" state.
   */
  useEffect(() => {
      if (runStatus === 0) {
          console.log("RunStatus - 0: Screen Focus");
          //Record current date & time
          setTimeStart(moment().format('LT'));
          setDay(moment().format('dddd'));
          setDate(moment().format('L'));
      }
      if (runStatus === 1) {
          console.log("RunStatus - 1: Initializing");
          subcriptionCountdown();
          getCurrentLocation();
      }
      if (runStatus === 7) {
          console.log("RunStatus - 7: Run-resume");
          resumeCountdown();
      }
      if (runStatus === 2) {
          setPaused(false);
          console.log("RunStatus - 2: Running");
      }
      if (runStatus === 3) {
          console.log("RunStatus - 3: Pause");
          unsubscribePosition();
          setPaused(true);
          TTS.getInitStatus().then(() => {
              TTS.setDefaultLanguage('en-US');
              // TTS.setDefaultRate(0.5);
              TTS.speak('Run Paused');
          });
      }
      if (runStatus === 4) {
          console.log("RunStatus - 4: BACK confirm");
          if (!paused) {
              unsubscribePosition();
          }
          Firestore.db_requesttoResetGameAtEnd(gameKey);
          navigation.dispatch(CommonActions.reset({index: 0, routes: [{name: 'AppTab'}]}));
      }
      if (runStatus === 8) { 
          console.log("RunStatus - 8: on BACK Press");
          Alert.alert(
              "Leave Run",
              "Are you sure you want to leave the run? The run record will not be saved.",
              [ { text:"Cancel", onPress: () => {} }, 
              { text:"Confirm", onPress: () => {setRunStatus(4)} }]
          )
          //Alert > (N)=>{close without change} (Y)=> setRunStatus (4)
      }
      if (runStatus === 9) {
          console.log("RunStatus - 9");
          setRunStatus(8);
      }
      if (runStatus === 5) {
          console.log("RunStatus - 5: Stop from Pause");
          setRunStatus(6);
      }
      if (runStatus === 6) {
          console.log("RunStatus - 6: Run End");
          //Reset Game Room to status 'request'
          Firestore.db_requesttoResetGameAtEnd(gameKey);

          if (distance >= 10) {
              for (var i=0;i<mapPositions.length;i++){
                  console.log("{latitude:"+mapPositions[i].latitude+",longitude:"+mapPositions[i].longitude+" ,},")
              }
              
              //Compile Data
              const record = {
                  distance:distance, 
                  positions:(mapPositions.length==0)?[{latitude:1.3452048,longitude:103.8464214 ,},
                    {latitude:1.3451908,longitude:103.8464228 ,},
                    {latitude:1.3451601,longitude:103.8464211 ,},
                     {latitude:1.3451461,longitude:103.8464196 ,},
                     {latitude:1.3451276,longitude:103.8464122 ,},
                     {latitude:1.3451106,longitude:103.8464057 ,},
                     {latitude:1.3450829,longitude:103.8463962 ,},
                     {latitude:1.3450529,longitude:103.8463928 ,},
                     {latitude:1.3450354,longitude:103.8463912 ,},
                     {latitude:1.3450064,longitude:103.8463858 ,},
                     {latitude:1.3449813,longitude:103.8463811 ,},
                     {latitude:1.3449656,longitude:103.8463775 ,},
                     {latitude:1.3449463,longitude:103.846375 ,},
                     {latitude:1.3449319,longitude:103.8463733 ,},
                     {latitude:1.3449045,longitude:103.8463707 ,},
                     {latitude:1.3448652,longitude:103.8463669 ,},
                     {latitude:1.3448077,longitude:103.8463526 ,},
                     {latitude:1.344756,longitude:103.846339 ,},
                     {latitude:1.3447247,longitude:103.8463304 ,},
                     {latitude:1.3446844,longitude:103.8463246 ,},
                     {latitude:1.3446628,longitude:103.846322 ,},
                     {latitude:1.344627,longitude:103.8463254 ,},
                     {latitude:1.3446076,longitude:103.8463293 ,},]:mapPositions, 
                  steps:steps, 
                  duration:duration,
                  time:timeStart,
                  day:day,
                  date:date,
                  id:moment().format(),
                  mode:mode,
              }             

              //Add to history + update personal stats (If the user sets to "recordHistory to true")
              Firestore.db_recordRun(record,
                  () => {
                      navigation.navigate("AlphaEndScreen", {
                          message:"Run Concluded",
                          distance:distance, 
                          positions:(mapPositions.length==0)?[ {latitude:1.3452048,longitude:103.8464214 ,},
                           {latitude:1.3451908,longitude:103.8464228 ,},
                           {latitude:1.3451601,longitude:103.8464211 ,},
                            {latitude:1.3451461,longitude:103.8464196 ,},
                            {latitude:1.3451276,longitude:103.8464122 ,},
                            {latitude:1.3451106,longitude:103.8464057 ,},
                            {latitude:1.3450829,longitude:103.8463962 ,},
                            {latitude:1.3450529,longitude:103.8463928 ,},
                            {latitude:1.3450354,longitude:103.8463912 ,},
                            {latitude:1.3450064,longitude:103.8463858 ,},
                            {latitude:1.3449813,longitude:103.8463811 ,},
                            {latitude:1.3449656,longitude:103.8463775 ,},
                            {latitude:1.3449463,longitude:103.846375 ,},
                            {latitude:1.3449319,longitude:103.8463733 ,},
                            {latitude:1.3449045,longitude:103.8463707 ,},
                            {latitude:1.3448652,longitude:103.8463669 ,},
                            {latitude:1.3448077,longitude:103.8463526 ,},
                            {latitude:1.344756,longitude:103.846339 ,},
                            {latitude:1.3447247,longitude:103.8463304 ,},
                            {latitude:1.3446844,longitude:103.8463246 ,},
                            {latitude:1.3446628,longitude:103.846322 ,},
                            {latitude:1.344627,longitude:103.8463254 ,},
                            {latitude:1.3446076,longitude:103.8463293 ,},
                            ]:mapPositions, 
                          steps:steps, 
                          duration:duration,
                          time:timeStart,
                          day:day,
                          date:date,
                          mode: mode,
                      });
                  },
                  (error) => {console.log(error)}    
              )
              
              //Update Stride Distance, only if user in Calibration mode
              if (mode=="Calibration") {
                  const strideDistance = (distance / steps)
                  Firestore.db_calibrateStride(strideDistance);
              }
          } else {

              Alert.alert(
                  "Run Stopped",
                  "You haven't covered enough ground to create a record. End Run?",
                  [ { text:"Continue", onPress: () => {setRunStatus(3)} }, 
                  { text:"Understood", onPress: () => {
                      navigation.dispatch(CommonActions.reset({index: 0, routes: [{name: 'AppTab'}],}),);
                      TTS.getInitStatus().then(()=> TTS.speak('Run Ended'));
                  } } ]
              )
          }
          
      }
  },[runStatus])

    //Added by Barnabas



    

    useEffect(() => {
        console.log("Here RICKY RICK")
        console.log(scrollToPage)
        if(scrollRef!=null){
          scrollHandler(scrollToPage)  
        }
        
    }, [scrollToPage])
    /**
     * This is a method to trigger the scroll effect on the "Run Tab" scrollview.
     * @param {Number} num A number value to be multiplied with width value.
     */
    const scrollHandler = (num) => {
        scrollRef.scrollTo({
            x: width * num,
            animated: true
    })};
  
    const scrollX = useRef(new Animated.Value(0)).current;
  
    const RunIndicator = scrollX.interpolate({
        inputRange: [ 0 , width],
        outputRange: [ '#282B30', '#424549'],
    });
    const WorkoutIndicator = scrollX.interpolate({
        inputRange: [ 0 , width],
        outputRange: [ '#424549', '#282B30'],
    });
    const RunHighlight = scrollX.interpolate({
        inputRange: [ 0 , width],
        outputRange: [ '#FFFFFF', '#424549'],
    });
    const WorkoutHighlight = scrollX.interpolate({
        inputRange: [ 0 , width],
        outputRange: [ '#424549', '#FFFFFF'],
    });
    //End By Barnabas

    return (
        <Animated.ScrollView
                style={{...styles.scrollview,flexDirection:'row'}}
                ref={ref => setScrollRef(ref)}
                horizontal
                snapToInterval={width}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                bounces={false}
                overScrollMode="never"
                disableIntervalMomentum={true}
                onScroll={Animated.event( [{nativeEvent: {contentOffset: {x: scrollX}}}], {useNativeDriver: false} )}
            >
                   {/* Map */}
            <View style={styles.mapContainer}>

                <View style={styles.componentContainer}>
                    <AlphaRunMapTimeRace2
                            runStatus={runStatus}
                            mapPositions={mapPositions} 
                            currCoord={currCoord}
                        />
                </View>

                {/* Map Overlap */}
                <View style={{
                    ...styles.componentContainer, position: 'absolute',
                    height:height,
                    width:width,
                    top: 0,
                    right: 0,
                    resizeMode: 'contain',
                    backgroundColor: 'transparent'
                }}>
                </View>
                
                {/* Ranking */}
                { friendList.length!=0?
                
                <View style={{...styles.listContent,backgroundColor:'transparent',width:width,position:'absolute',left:0,top:height*0.5,height:height * 0.15*friendList.length*3}}>
                    <ScrollView 
                            style={{...styles.list,backgroundColor:'transparent'}}
                            contentContainerStyle={{...styles.listContent,width:width,height:height * 0.15*friendList.length*3}}
                            >
                                {
                                    friendList.map((item)=>{
                                        return <FriendItemDragTimeRace item={item}
                                        positions={runnerPositions}
                                        setPositions={(item)=>{setRunnerPositions(item)}}
                                        newPositions={newRunnerPositions}
                                        friendList={friendList}
                                        selfID={selfID}/>
                                    })

                                }


                    </ScrollView>

                </View>
                :
                <></>    

                }
                <View style={{position:'absolute',top:0, right:0, width:width*0.2,height:width*0.2,}}>
                    <TouchableOpacity onPress={() => {
                        setDistance((prevCurrentDistance) => (prevCurrentDistance+5));
                        //Updates Every 50m
                        setDistance10m((prevCurrentDistance) => (prevCurrentDistance+5));
                    }
                    }>
                        <View style={{width:width*0.2,height:width*0.2,}}>

                        </View>
                    </TouchableOpacity>
                </View>


            </View>
            
            
            <View style={{backgroundColor: '#282B30',width:width, height:height}}>
                <View style={screenStyle.screen}>
                    <View style = {{height: height*0.05, width: width}}>
                        <Text style={{textAlign:'center',color:'green', fontSize:25}}>
                            ACTIVE RACE
                        </Text>
                    </View>
                    <View>
                        <Text style={textStyle.timeDisplay}>
                            <AlphaRunTimer
                            runStatus={runStatus}
                            setDuration={setDuration}
                            distance={distance}
                            km={km}
                            setKm={setKm}
                            />
                        </Text>
                    </View>
                    <Separator />
                    <View>
                        <Text style={textStyle.coloredRed}>
                            TIME
                        </Text>
                    </View>
                    <View style={textStyle.distanceDisplay}>
                        <AlphaRunDistance
                            distance={distance}
                        />
                    </View>
                    <Separator />
                    <View>
                        <Text style={textStyle.coloredRed}>
                            KILOMETERS
                        </Text>
                    </View>
                    <View style = {speedLayout.ridesFriends}>
                        <View style={{width:0.5*width, height:0.15*height - 4}}>
                            <Text style={speedLayout.numbers}>
                                {duration}
                            </Text>
                            <Text style={speedLayout.coloredRedspeed}>
                                CURRENT SPEED
                            </Text>
                        </View>
                        <View style = {speedLayout.verticleLine}></View>
                        <View style={{width:0.5*width, height:0.15*height-4}}>
                            <Text style={speedLayout.numbers}>
                                {steps}
                            </Text>
                            <Text style={speedLayout.coloredRedspeed}>
                                STEPS
                            </Text>
                        </View>
                    </View>
                    <Separator />
                    <View style = {speedLayout.ridesFriendsBottom}>
                        <View style = {{justifyContent: 'space-evenly', height: 0.25*height, width:0.3*width, alignItems:'center'}}>
                                {(runStatus === 2 || (runStatus === 8 && !paused) || (runStatus === 9 && !paused)) ?  <TouchableOpacity style={newstyles.button} onPress={() => setRunStatus(3)}>
                                    <Image 
                                        source={require('../../assets/icons/ExercisePause.png')}
                                        resizeMode= 'contain'
                                        style={newstyles.buttonIcon}
                                    />
                                </TouchableOpacity> : <></>}
                                {(runStatus === 3 || (runStatus === 8 && paused) || (runStatus === 9 && paused)) ? <TouchableOpacity style={newstyles.button} onPress={() => setRunStatus(7)}>
                                    <Image 
                                        source={require('../../assets/icons/ExercisePlay.png')}
                                        resizeMode= 'contain'
                                        style={newstyles.startIcon}
                                    />
                                </TouchableOpacity> : <></>}
                                {(runStatus === 3 || (runStatus === 8 && paused) || (runStatus === 9 && paused)) ? 
                                ( 
                                    <HoldableButton 
                                        radius={0.05 * height}
                                        onSuccess={() => setRunStatus(5)}
                                        imageSource={require('../../assets/icons/ExerciseStop.png')}
                                    />
                                ) : <></>}
                        </View>
                        <View style = {speedLayout.verticleLine}></View>
                        <View style={{height:0.3*height, width:width*0.5, alignItems:'center', flexDirection: 'column'}}>
                            <View style={{height:0.15*height -4-0.05*height,overflow:'hidden'}}>
                                <Text style={{fontSize: 30, color:'orange', textAlign:'center'}}>
                                    {newRunnerPositions!=null?newRunnerPositions[selfID]+1:5}
                                </Text>
                                <Text style={{...speedLayout.coloredRedspeed,}}>
                                    POSITION
                                </Text>
                            </View>
                            <View style = {{marginVertical: 0.01*height,
                                            borderBottomColor: 'white',
                                            borderBottomWidth: 10, //StyleSheet.hairlineWidth,
                                            marginHorizontal: 0,
                                            height:0.03*height}}/>
                            <View>

                        </View>
                        </View>
                    </View>
                </View>
                <AlphaRunCountdown
                    countdown={countdown}
                    countdownMsg={countdownMsg}
                />
                <View style={{position:'absolute',top:0, right:0, width:width*0.2,height:width*0.2,}}>
                    <TouchableOpacity onPress={() => {
                        setDistance((prevCurrentDistance) => (prevCurrentDistance+5));
                        //Updates Every 50m
                        setDistance10m((prevCurrentDistance) => (prevCurrentDistance+5));
                    }
                    }>
                        <View style={{width:width*0.2,height:width*0.2,}}>

                        </View>
                    </TouchableOpacity>
                </View>
                {/* Ranking */}
                { friendList.length!=0?
                
                <View style={{...styles.listContent,backgroundColor:'transparent',position:'absolute',bottom:0, right:0,width:width*0.6,height:height *0.25, justifyContent:'center'}}>
                    <ScrollView 
                            style={{...styles.list,backgroundColor:'transparent',width:width*0.5}}
                            contentContainerStyle={{...styles.listContent,height:height * 0.06*friendList.length*3}}
                            >
                                {
                                    friendList.map((item)=>{
                                        return <FriendItemDragTimeRaceMini item={item}
                                        positions={runnerPositions}
                                        setPositions={(item)=>{setRunnerPositions(item)}}
                                        newPositions={newRunnerPositions}
                                        friendList={friendList}
                                        selfID={selfID}/>
                                    })

                                }


                    </ScrollView>

                </View>
                :
                <></>    

                }
            </View>
        </Animated.ScrollView>
    );
};

const newstyles = StyleSheet.create({
  screen:{
      width: width,
      height: height,
      backgroundColor: '#282b30',
  },
  contentContainer:{
      width: width,
      height: height * 0.4,
      zIndex: 1,
      paddingTop: height * 0.05,
      borderBottomRightRadius: 5,
      borderBottomLeftRadius: 5,
      justifyContent: 'center',
      backgroundColor: '#282B30',
  },
  distanceContainer:{
      width: width,
      height: height * 0.1,
      // backgroundColor: 'purple',
  },
  secondaryDataContainer:{
      width: width,
      height: height * 0.1,
      flexDirection: 'row',
      // backgroundColor: 'green',
  },
  timeContainer:{
      width: width * 0.5,
      height: height * 0.1,
      // backgroundColor: 'blue',
  },
  stepsContainer:{
      width: width * 0.5,
      height: height * 0.1,
      // backgroundColor: 'grey',
  },
  buttonContainer:{
      width: width,
      height: height * 0.12,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      // backgroundColor: 'orange',
  },
  button:{
      height: height * 0.1,
      aspectRatio: 1,
      borderRadius: height,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#7289DA',
  },
  buttonIcon:{
      height: height * 0.05,
      aspectRatio: 1,
      tintColor: '#BABBBF',
  },
  startIcon:{
      height: height * 0.05,
      aspectRatio: 1,
      transform: [{translateX: width * 0.01}],
      tintColor: '#BABBBF',
  },
  mapContainer:{
      width: width,
      height: height * 0.7,
      position: 'absolute',
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: 'yellow',
  },
});

const screenStyle = StyleSheet.create({
  screen: {
    //marginHorizontal: 20,
    //marginVertical: 20,
  }
})

const Separator = () => (
  <View style={styles.separator} />
);

const textStyle = StyleSheet.create({
  coloredRed: {
    color: 'red',
    textAlign: 'center',
    height: 0.05*height - 4,
    fontSize:18,
    //backgroundColor:'blue'
  },

  timeDisplay: {
    textAlign:'center',
    height: 0.1*height - 4,
    fontSize: 80,
    color: 'white',
    //backgroundColor:'pink',
  },

  distanceDisplay: {
    textAlign: 'center',
    fontSize: 100,
    height: 0.2*height - 4,
    color: 'white',
    //backgroundColor:'brown',
    justifyContent:'center',
    alignContent:'center',
  },

  speedDisplay: {
    fontSize:0.0625*height,
    color: 'white',
  }
})

const buttonslayout = StyleSheet.create({
  SubmitButtonStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 0.25*width,
      height: 0.05*height - 5,
      marginLeft:1,
      marginRight:1,
      //backgroundColor:'yellow',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#fff',
      marginBottom: 5
  },
  roundButton3: {
        width: 0.1*width,
        height: 0.05*height - 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        backgroundColor: 'yellow',
        marginBottom: 5
  },
});

const speedLayout = StyleSheet.create({
  ridesFriends: {
      height: 0.15*height - 4,
      //paddingTop: 0.025*height,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
      color:'white',
  },
  ridesFriendsBottom: {
    height: 0.3*height - 4,
    //paddingTop: 0.025*height,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    color:'white',
  },
  numbers: {
      fontSize: 0.0625*height,
      color: 'white',
      fontWeight: 'bold',
      textAlign:'center'
  },
  verticleLine: {
      height: '100%',
      width: 1,
      backgroundColor: 'white',
  },
  coloredRedspeed: {
      color: 'red',
      textAlign: 'center',
      fontSize: 0.01875*height
  },
})

const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderBottomColor: 'white',//'#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 0.05*height
  },
  //Added by Barnabas
  mapContainer:{
    width: width,
    height: height,
    //position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    },

    scrollview:{
        // backgroundColor: 'green',
        height: height * 0.73,
    },

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
    componentContainer:{
        width: width,
        height: height * 1,
        backgroundColor: '#282B30',
    },  
    list:{
        width: width,
        height: height * 0.2,
        backgroundColor: 'pink',
        //overflow:'hidden'

    },
    listContent:{
        width: width*0.7,
        //paddingBottom: height * 0.1,
        // backgroundColor: 'red',

    },
    //End Added by Barnabas
});

export default AlphaTimeRace;