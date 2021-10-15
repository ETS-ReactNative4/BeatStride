import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet,  Text,  View, Dimensions, Animated, TouchableWithoutFeedback } from 'react-native';
//import { auth as SpotifyAuth,  remote as SpotifyRemote } from 'react-native-spotify-remote';
import * as geolib from 'geolib';
import Screen from '../MainScreen';
import RunTab from './components/RunTab';
import WorkoutTab from './components/WorkoutTab';
import * as Location from 'expo-location'

// import * as Spotify from '../Music/components/spotify_player_controls';
import * as LocationLib from '../../api/LocationPermissions';

const {width, height} = Dimensions.get("window")


/**
 * This is a functional component representing the Exercise screen.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const AlphaExerciseScreen = () => {

    const [permissionsStatus, setPermissionsStatus] = useState(3);
    const [currCoord, setCurrCoord] = useState( {latitude: 1.377621, longitude: 103.805178,} );
    const [scrollToPage, setScrollToPage]=useState(0);
    //From Google PLaces API
    const [parkList, setParkList] = useState([]);
    const [navToCoord, setNavToCoord]= useState();
    //const [timearray,setTimearray]=useState([]);


    useEffect(() => {
        handleParkSearch ();
        console.log(parkList);
        console.log("Check coord USEEFFECT" + currCoord.longitude+ " "+currCoord.latitude);
      }, [currCoord])

      useEffect(() => {
        // !(parkList[0].hasOwnProperty('distance'))
        console.log("parkList: "+parkList.length);
        console.log(parkList);
        for(var i = 0; i < parkList.length; i++) {
            var obj = parkList[i];
            console.log(obj.name+" "+parkList[i]["distance"]);
        }
      }, [parkList])


    const handleParkSearch = async() => {
        const url  = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
        const location = `location=${currCoord.latitude},${currCoord.longitude}`;
        const radius = '&radius=3000';
        const type = '&keyword=park';
        const key = '&key=AIzaSyADjrNgTK8R1JckFVwOmIRhJvPCO-hZjRQ';
        const parkSearchUrl = url + location + radius + type + key;
        console.log(parkSearchUrl);
        fetch(parkSearchUrl)
        .then(response => response.json())
        .then(result =>{
            //console.log(result.results.length);
            //Step 1: Calculate Distance and add distance as a new field to JSON File
            for(var i = 0; i < result.results.length; i++) {
                var obj = result.results[i];
                const distGain=distanceCalculate (obj.geometry.location, currCoord)
                //console.log(obj.name+" "+distGain);
                result.results[i]["distance"]=distGain;
                console.log(obj.name+" "+result.results[i]["distance"]);
                
                
                //console.log(" NorthEast "+obj.geometry.viewport.northeast.lat+" South West"+obj.geometry.viewport.southwest.lat);
                var NE={latitude:obj.geometry.viewport.northeast.lat, longitude:obj.geometry.viewport.northeast.lng};
                var SE={latitude:obj.geometry.viewport.southwest.lat, longitude:obj.geometry.viewport.northeast.lng};
                var SW={latitude:obj.geometry.viewport.southwest.lat, longitude:obj.geometry.viewport.southwest.lng};
                var NW={latitude:obj.geometry.viewport.northeast.lat, longitude:obj.geometry.viewport.southwest.lng};
                result.results[i]["polygon"]=[NE,SE,SW,NW];
            }
            //Step 2: Sort in assending Distance and only keep the first 4 results.
            result.results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
            for(var i = 0; i < result.results.length; i++) {
                var obj = result.results[i];
                console.log(obj.name+" "+result.results[i]["distance"]);
            }
            return setParkList(result.results.slice(0,4));
        } 
            );
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
        //console.log('Distance Gained')
        //console.log(distGain)
        return distGain;
    }

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
        }
        if (permissionsStatus === 3) {
            setPermissionsStatus(0)
            console.log('P_Status : 3 - App Start')
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
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * This is a render effect triggered on component mount.
     */
    // useEffect(async() => {
    //     const spotifyConfig = Spotify.spotifyConfig

    //     const isConnected = await SpotifyRemote.isConnectedAsync(); //returns a boolean, true/false
    //     if (!isConnected) {
    //         const session = await SpotifyAuth.authorize(spotifyConfig);
    //         await SpotifyRemote.connect(session.accessToken);
    //     }
    // }, [])

    /* SCROLL ANIMATIONS */
    const [scrollRef , setScrollRef] = useState(null)


    

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


    return (
        <Screen title={"Exercise"}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Exercise</Text>
            </View>

            {/* Tab Indicator */}
            <View style={styles.tabIndicator}>

                <View style={{flexDirection: 'row'}}>
                  {/* Run Tab */}
                  <TouchableWithoutFeedback onPress={() => setScrollToPage(0)}>
                      <View>
                          <Animated.View style={{...styles.tab, backgroundColor: RunIndicator}}>
                              <Text style={styles.tabText}>Run</Text>
                          </Animated.View>

                          <Animated.View style={{...styles.tabHighlight, backgroundColor: RunHighlight,}}/>
                      </View>
                  </TouchableWithoutFeedback>

                  {/* Workout Tab */}
                  <TouchableWithoutFeedback onPress={() => setScrollToPage(1)}>
                      <View>
                          <Animated.View style={{...styles.tab, backgroundColor: WorkoutIndicator}}>
                              <Text style={styles.tabText}>Workout</Text>
                          </Animated.View>

                          <Animated.View style={{...styles.tabHighlight, backgroundColor: WorkoutHighlight,}}/>
                      </View>
                  </TouchableWithoutFeedback>
                </View>
                
            </View>

            <Animated.ScrollView
                style={styles.scrollview}
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
                <RunTab 
                    permissionsStatus={permissionsStatus}
                    currCoord={currCoord}

                    navToCoord={navToCoord}
                    setNavToCoord={(navToCoord)=>{setNavToCoord(navToCoord)}}

                    setCurrCoord={(currCoord)=>{setCurrCoord(currCoord)}}
                    parkList={parkList}

                    
                    />
                <WorkoutTab
                    currCoord={currCoord}
                    setCurrCoord={(currCoord)=>{setCurrCoord(currCoord)}}

                    navToCoord={navToCoord}
                    setNavToCoord={(navToCoord)=>{setNavToCoord(navToCoord)}}

                    scrollToPage={scrollToPage}
                    setScrollToPage={(srollToPage)=>{setScrollToPage(srollToPage)}}
                    parkList={parkList}
                    />
            </Animated.ScrollView>


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
    headerText:{
        color: '#BABBBF',
        fontSize: 28,
        fontWeight: 'bold',
        height: height * 0.1,
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
    tabIndicator:{
        width: width,
        height: height * 0.07,
        backgroundColor: '#1e2124',
        overflow: 'hidden',
    },
    tab:{
        width: width * 0.5,
        height: height * 0.07,
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
    scrollview:{
        // backgroundColor: 'green',
        height: height * 0.73,
    },
})

export default AlphaExerciseScreen;
