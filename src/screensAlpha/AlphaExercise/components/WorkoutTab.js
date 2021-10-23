import React, { useState, useEffect ,useRef,useCallback} from 'react';
import { StyleSheet,  Text,  View, Dimensions, FlatList,SafeAreaView } from 'react-native';
import { IconButton } from "react-native-paper";
import * as geolib from 'geolib';

//Barn
// import * as Firestore from '../../../api/firestore';

import HistoryItem from './HistoryItem';
import WorkoutParkItem from './WorkoutParkItem';
import WorkoutTimeItem from './WorkoutTimeItem';
import { ScrollView } from 'react-native-gesture-handler';
const {width, height} = Dimensions.get("window")

/**
 * This is a functional component representing the Workout Tab in Exercise page.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const WorkoutTab = (props) => {
    const currCoord=props.currCoord
    const [history, setHistory] = useState([])
    const [totalDistance, setTotalDistance] = useState(35000)
    const [totalRuns, setTotalRuns] = useState(6)
    const [workOutActivities,setWorkOutActivities]=useState([{'name':'Time Racing','ImgeSRC':require("../../../assets/icons/HistoryTabTimeRunImg.png"),"discription":"Invite Friends"},
    {'name':'OutRun Easy','ImgeSRC':require("../../../assets/icons/HistoryTabTimeRunEasyRunning.png"),"discription":"8min/km"},
    {'name':'OutRun Intermediate','ImgeSRC':require("../../../assets/icons/HistoryTabTimeRunIntRunning.png"),"discription":"6min/km"},
    {'name':'OutRun Pro','ImgeSRC':require("../../../assets/icons/HistoryTabTimeRunProRunning.png"),"discription":"5min/km"},
])

    const parkList=props.parkList;
    console.log("In Workout Tab"+parkList);

    const scrollToPage=props.scrollToPage;
    const setScrollToPage=props.setScrollToPage;

    const navToCoord=props.navToCoord;
    const setNavToCoord=props.setNavToCoord;

    const typeList=props.typeList;
    const typeListIdx=props.typeListIdx;
    const setTypeListIdx=props.setTypeListIdx;

    const subscribeParkLocations=props.subscribeParkLocations;


    const DATA = [
        {
            distance:78.2,
            positions: {},
            steps: 198,
            duration:114000,
            time:'',
            day:"Saturday",
            date:"10/02/2021",
            mode:'play',
            id:1
        },
        {
            distance:78.2,
            positions: {},
            steps: 198,
            duration:114000,
            time:'',
            day:"Saturday",
            date:"10/02/2021",
            mode:'play',
            id:2
        },
        {
            distance:78.2,
            positions: {},
            steps: 198,
            duration:114000,
            time:'',
            day:"Saturday",
            date:"10/02/2021",
            mode:'play',
            id:3
        },
        {
            distance:78.2,
            positions: {},
            steps: 198,
            duration:114000,
            time:'',
            day:"Saturday",
            date:"10/02/2021",
            mode:'play',
            id:4
        },
      ];
    
    //   useEffect(() => {
    //     handleParkSearch ();
    //     console.log(parkList);
    //     console.log("Check coord USEEFFECT" + props.currCoord.longitude+ " "+props.currCoord.latitude);
    //   }, [props.currCoord])

    //   useEffect(() => {
    //     // !(parkList[0].hasOwnProperty('distance'))
    //     console.log("parkList: "+parkList.length);
    //     console.log(parkList);
    //     for(var i = 0; i < parkList.length; i++) {
    //         var obj = parkList[i];
    //         console.log(obj.name+" "+parkList[i]["distance"]);
    //     }
    //   }, [parkList])


    // const handleParkSearch = async() => {
    //     const url  = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
    //     const location = `location=${props.currCoord.latitude},${props.currCoord.longitude}`;
    //     const radius = '&radius=3000';
    //     const type = '&keyword=park';
    //     const key = '&key=AIzaSyADjrNgTK8R1JckFVwOmIRhJvPCO-hZjRQ';
    //     const parkSearchUrl = url + location + radius + type + key;
    //     console.log(parkSearchUrl);
    //     fetch(parkSearchUrl)
    //     .then(response => response.json())
    //     .then(result =>{
    //         //console.log(result.results.length);
    //         //Step 1: Calculate Distance and add distance as a new field to JSON File
    //         for(var i = 0; i < result.results.length; i++) {
    //             var obj = result.results[i];
    //             const distGain=distanceCalculate (obj.geometry.location, props.currCoord)
    //             //console.log(obj.name+" "+distGain);
    //             result.results[i]["distance"]=distGain;
    //             console.log(obj.name+" "+result.results[i]["distance"]);
                
                
    //             //console.log(" NorthEast "+obj.geometry.viewport.northeast.lat+" South West"+obj.geometry.viewport.southwest.lat);
    //             var NE={latitude:obj.geometry.viewport.northeast.lat, longitude:obj.geometry.viewport.northeast.lng};
    //             var SE={latitude:obj.geometry.viewport.southwest.lat, longitude:obj.geometry.viewport.northeast.lng};
    //             var SW={latitude:obj.geometry.viewport.southwest.lat, longitude:obj.geometry.viewport.southwest.lng};
    //             var NW={latitude:obj.geometry.viewport.northeast.lat, longitude:obj.geometry.viewport.southwest.lng};
    //             result.results[i]["polygon"]=[NE,SE,SW,NW];
    //         }
    //         //Step 2: Sort in assending Distance and only keep the first 4 results.
    //         result.results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    //         for(var i = 0; i < result.results.length; i++) {
    //             var obj = result.results[i];
    //             console.log(obj.name+" "+result.results[i]["distance"]);
    //         }
    //         return setParkList(result.results.slice(0,4));
    //     } 
    //         );
    // }

    // /* [Distance Calculator] */
    // /**
    //  * This method calculates the distance between 2 coordinates.
    //  * @param {Object} prev_Pos A coordinate Object with the following fields: latitude (number) & longitude (number).
    //  * @param {Object} curr_Pos A coordinate Object with the following fields: latitude (number) & longitude (number).
    //  * @returns 
    //  */
    //  const distanceCalculate = (prev_Pos, curr_Pos) => {
    //     const distGain = geolib.getDistance (prev_Pos, curr_Pos, 0.1)
    //     //console.log('Distance Gained')
    //     //console.log(distGain)
    //     return distGain;
    // }
    //Barn
    /**
     * This is a render effect triggered on component mount.
     */
    // useEffect(async() => {
    //     Firestore.db_historyView(
    //         (historyList) => { setHistory(historyList.reverse())},
    //         (error) => {console.log('history view fail')}
    //     )
        
    //     Firestore.db_getUserDataSnapshot(
    //         (userData) => {
    //             setTotalDistance(userData.totalDistance)
    //             setTotalRuns(userData.runCount)
    //         },
    //         (error) => {console.log(error)},
    //     )
    // },[])

    //Barn
    // useEffect(async() => {
    //         Firestore.db_historyView(
    //             (historyList) => { setHistory(historyList.reverse())},
    //             (error) => {console.log('history view fail')}
    //         )
            
    //         Firestore.db_getUserDataSnapshot(
    //             (userData) => {
    //                 setTotalDistance(userData.totalDistance)
    //                 setTotalRuns(userData.runCount)
    //             },
    //             (error) => {console.log(error)},
    //         )
    //     },[])

     //Barn
    //  const exampleItems = [
    //     {
    //       title: 'Item 6',
    //       text: 'Text 6',
    //     },
    //     {
    //       title: 'Item 2',
    //       text: 'Text 2',
    //     },
    //     {
    //       title: 'Item 3',
    //       text: 'Text 3',
    //     },
    //     {
    //       title: 'Item 4',
    //       text: 'Text 4',
    //     },
    //     {
    //       title: 'Item 5',
    //       text: 'Text 5',
    //     },
    //   ];
    const [activeIndex, setActiveIndex] = useState(0);
    //const [carouselItems, setCarouselItems] = useState(exampleItems);
    const ref = useRef(null);
  
    const renderItem = useCallback(({ item, index }) => (
      <View
        style={{
          backgroundColor: 'floralwhite',
          borderRadius: 5,
          height: 250,
          padding: 50,
          marginLeft: 25,
          marginRight: 25,
        }}
      >
        <Text style={{ fontSize: 30 }}>{item.title}</Text>
        <Text>{item.text}</Text>
      </View>
    ), []);


    return (
        <ScrollView>
            <View style={styles.componentContainer}>

                {/* Stats */}

                {/* <SafeAreaView style={{ flex: 1, backgroundColor: 'rebeccapurple', paddingTop: 50 ,height:250}}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        <Carousel
                            nestedScrollEnabled={true}
                            layout="default"
                            ref={ref}
                            data={carouselItems}
                            sliderWidth={300}
                            itemWidth={300}
                            renderItem={renderItem}
                            onSnapToItem={(index) => setActiveIndex(index)}
                            />
                    </View>
                </SafeAreaView> */}

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>SPACE RACING </Text>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>Find a park near you to conquer & explore.</Text>
                </View>
                <View style={{...styles.list,flexDirection:'row',height: height * 0.25,justifyContent:'space-evenly'}}>
                    {parkList.slice(0, 2).map(item => {return ( 
                        <WorkoutParkItem
                            currCoord={currCoord}

                            parkData={item}
                            scrollToPage={scrollToPage}
                            setScrollToPage={(srollToPage)=>{setScrollToPage(srollToPage)}}
                            navToCoord={navToCoord}
                            setNavToCoord={(navToCoord)=>{setNavToCoord(navToCoord)}}

                            typeList={typeList}
                            typeListIdx={typeListIdx}
                            setTypeListIdx={(listIdx)=>setTypeListIdx(listIdx)}

                            
                            subscribeParkLocations={subscribeParkLocations}
                        />)})}
                </View>

                <View style={{...styles.list,flexDirection:'row',height: height * 0.28,paddingTop:5,paddingBottom:5,justifyContent:'space-evenly'}}>
                    {parkList.slice(2, 4).map(item => {return ( 
                        <WorkoutParkItem

                                                    
                            currCoord={currCoord}
                            parkData={item}
                            scrollToPage={scrollToPage}
                            setScrollToPage={(srollToPage)=>{setScrollToPage(srollToPage)}}
                            navToCoord={navToCoord}
                            setNavToCoord={(navToCoord)=>{setNavToCoord(navToCoord)}}

                            typeList={typeList}
                            typeListIdx={typeListIdx}
                            setTypeListIdx={(listIdx)=>setTypeListIdx(listIdx)}

                            subscribeParkLocations={subscribeParkLocations}
                        />)})}
                </View>

                <View style={{...styles.titleContainer,backgroundColor: '#7289DA',}}>
                    <Text style={styles.titleText}>TIME RACING </Text>
                </View>
                <View style={{...styles.descriptionContainer}}>
                    <Text style={styles.descriptionText}>Run with Friends Remotely. Even Apart, we are together!</Text>
                </View>
                
                {/* <View style={{...styles.list,flexDirection:'row',height: height * 0.25,marginTop:5,justifyContent:'space-evenly'}}>
                    {props.parkList.slice(0, 2).map(item => {return ( 
                        <WorkoutTimeItem
                            parkData={item}
                            scrollToPage={props.scrollToPage}
                            setScrollToPage={(srollToPage)=>{props.setScrollToPage(srollToPage)}}
                            navToCoord={props.navToCoord}
                            setNavToCoord={(navToCoord)=>{props.setNavToCoord(navToCoord)}}
                            imageSRC={require("../../../assets/icons/HistoryTabTimeRunImg.png")}
                        />)})}
                </View> */}
                <View style={{...styles.list,flexDirection:'row',height: height * 0.28,paddingTop:5,paddingBottom:5,justifyContent:'flex-start'}}>
                    {workOutActivities.slice(0, 1).map(item => {return ( 
                        <WorkoutTimeItem
                            scrollToPage={scrollToPage}
                            setScrollToPage={(srollToPage)=>{setScrollToPage(srollToPage)}}
                            imageSRC={item.ImgeSRC}
                            name={item.name}
                            discription={item.discription}

                            typeList={typeList}
                            typeListIdx={typeListIdx}
                            setTypeListIdx={(listIdx)=>setTypeListIdx(listIdx)}
                        />)})}
                </View>
                <View style={{...styles.titleContainer,backgroundColor: '#7289DA',}}>
                    <Text style={{...styles.titleText,fontSize:20}}>OUTRUN YOURSELF </Text>
                </View>
                <View style={{...styles.descriptionContainer}}>
                    <Text style={styles.descriptionText}>Guided Run to outrun yourself!</Text>
                </View>
                
                {/* <View style={{...styles.list,flexDirection:'row',height: height * 0.25,marginTop:5,justifyContent:'space-evenly'}}>
                    {props.parkList.slice(0, 2).map(item => {return ( 
                        <WorkoutTimeItem
                            parkData={item}
                            scrollToPage={props.scrollToPage}
                            setScrollToPage={(srollToPage)=>{props.setScrollToPage(srollToPage)}}
                            navToCoord={props.navToCoord}
                            setNavToCoord={(navToCoord)=>{props.setNavToCoord(navToCoord)}}
                            imageSRC={require("../../../assets/icons/HistoryTabTimeRunImg.png")}
                        />)})}
                </View> */}
                <View style={{...styles.list,flexDirection:'row',height: height * 0.28,paddingTop:5,paddingBottom:5,justifyContent:'space-evenly'}}>
                    {workOutActivities.slice(1, 3).map(item => {return ( 
                        <WorkoutTimeItem
                            scrollToPage={scrollToPage}
                            setScrollToPage={(srollToPage)=>{setScrollToPage(srollToPage)}}
                            imageSRC={item.ImgeSRC}
                            name={item.name}
                            discription={item.discription}

                            typeList={typeList}
                            typeListIdx={typeListIdx}
                            setTypeListIdx={(listIdx)=>setTypeListIdx(listIdx)}
                        />)})}
                </View>
                <View style={{...styles.list,flexDirection:'row',height: height * 0.28,paddingTop:5,paddingBottom:5,justifyContent:'flex-start'}}>
                    {workOutActivities.slice(3, 4).map(item => {return ( 
                        <WorkoutTimeItem
                            scrollToPage={scrollToPage}
                            setScrollToPage={(srollToPage)=>{setScrollToPage(srollToPage)}}
                            imageSRC={item.ImgeSRC}
                            name={item.name}
                            discription={item.discription}

                            typeList={typeList}
                            typeListIdx={typeListIdx}
                            setTypeListIdx={(listIdx)=>setTypeListIdx(listIdx)}
                        />)})}
                </View>
            </View>
        </ScrollView>
        
            

        
    );
};

const styles = StyleSheet.create({
    componentContainer:{
        width: width,
        height: height * 2,
        backgroundColor: '#282B30',
    },  
    statsContainer:{
        width: width,
        height: height * 0.15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#424549',
        backgroundColor: '#282B30',
        
    },
    titleContainer:{
        width: width * 0.65,
        height: height * 0.08,
        justifyContent:'center',
        paddingLeft: width * 0.7 * 0.1,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: '#BABBBF',
        //backgroundColor: 'pink',
    },
    titleText:{
        fontWeight: 'bold',
        fontSize: 24,
        color: '#FFFFFF',
    },
    descriptionContainer:{
        width: width,
        height: height * 0.05,
        paddingLeft: width * 0.7 * 0.05,
        paddingTop: height * 0.08 * 0.1,
        // backgroundColor: 'purple',
    },
    descriptionText:{
        fontSize: 12,
        color: '#BABBBF',
    },
    statsComponent:{
        width: width * 0.5,
        alignItems: 'center',
        paddingHorizontal: width * 0.01,
        // backgroundColor: 'pink',
    },
    statsValue:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    statsText:{
        fontSize: 12,
        color: '#BABBBF'
    },
    list:{
        width: width,
        //height: height * 0.58,//Original
        height: height* 0.2,
        //backgroundColor: 'pink',
        borderColor:'red',
    },
    listContent:{
        alignItems: 'center',
        paddingVertical: height * 0.01,
    },
    emptyList: {
        width: width,
        height: height * 0.58,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    emptyText:{
        fontSize: 14,
        color: '#72767D'
    }
})

export default WorkoutTab;
