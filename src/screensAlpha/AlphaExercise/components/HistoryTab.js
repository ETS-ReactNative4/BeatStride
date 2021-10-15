import React, { useState, useEffect ,useRef,useCallback} from 'react';
import { StyleSheet,  Text,  View, Dimensions, FlatList,SafeAreaView } from 'react-native';
import { IconButton } from "react-native-paper";
import * as geolib from 'geolib';

//Barn
// import * as Firestore from '../../../api/firestore';

import HistoryItem from './HistoryItem';
import HistoryParkItem from './HistoryParkItem';
const {width, height} = Dimensions.get("window")

/**
 * This is a functional component representing the History Tab in Exercise page.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const HistoryTab = (props) => {
    const [history, setHistory] = useState([])
    const [totalDistance, setTotalDistance] = useState(35000)
    const [totalRuns, setTotalRuns] = useState(6)
    const [parkList, setParkList] = useState([])
    console.log("In HistoryTab"+props.parkList);
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
            <View style={{...styles.list,flexDirection:'row',height: height * 0.25,justifyContent:'space-evenly'}}>
                {props.parkList.slice(0, 2).map(item => {return ( 
                    <HistoryParkItem
                        parkData={item}
                        scrollToPage={props.scrollToPage}
                        setScrollToPage={(srollToPage)=>{props.setScrollToPage(srollToPage)}}
                        navToCoord={props.navToCoord}
                        setNavToCoord={(navToCoord)=>{props.setNavToCoord(navToCoord)}}
                    />)})}
            </View>
            <View style={{...styles.list,flexDirection:'row',height: height * 0.25,paddingTop:5,paddingBottom:5,justifyContent:'space-evenly'}}>
                {props.parkList.slice(2, 4).map(item => {return ( 
                    <HistoryParkItem
                        parkData={item}
                        scrollToPage={props.scrollToPage}
                        setScrollToPage={(srollToPage)=>{props.setScrollToPage(srollToPage)}}
                        navToCoord={props.navToCoord}
                        setNavToCoord={(navToCoord)=>{props.setNavToCoord(navToCoord)}}
                    />)})}
            </View>
            {/* <FlatList
                style={styles.list}
                contentContainerStyle={styles.listContent}
                numColumns={2}
                //data={history}
                data={parkList}
                keyExtractor={item => item.id}
                renderItem={({item}) => 
                    <HistoryParkItem
                        parkData={item}
                        scrollToPage={props.scrollToPage}
                        setScrollToPage={(srollToPage)=>{props.setScrollToPage(srollToPage)}}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyList}>
                        <IconButton icon="run" style={{ margin: 0 }} color={'#72767D'} size={height * 0.045}/>
                        <Text style={styles.emptyText}>No Run History</Text>
                    </View>
                }
            /> */}
            <FlatList
                style={styles.list}
                contentContainerStyle={styles.listContent}
                numColumns={1}
                //data={history}
                data={DATA}
                keyExtractor={item => item.id}
                renderItem={({item}) => 
                    <HistoryItem
                        distance={item.distance} 
                        positions={item.positions}
                        steps={item.steps}
                        duration={item.duration}
                        time={item.time}
                        day={item.day}
                        date={item.date}
                        mode={item.mode}
                        id={item.id}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyList}>
                        <IconButton icon="run" style={{ margin: 0 }} color={'#72767D'} size={height * 0.045}/>
                        <Text style={styles.emptyText}>No Run History</Text>
                    </View>
                }
            />

        </View>
    );
};

const styles = StyleSheet.create({
    componentContainer:{
        width: width,
        height: height * 0.73,
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

export default HistoryTab;
