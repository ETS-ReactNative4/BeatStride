import React,{useRef,useEffect,useState} from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Polyline, Circle, Polygon } from 'react-native-maps';
import * as geolib from 'geolib';
const {width, height} = Dimensions.get("window")
//Polygon: MapView

/**
 * This is a functional component representing the Map display with route traced during a run.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const AlphaRunMap = (props) => {
    const runStatus = props.runStatus;
    const mapPositions = props.mapPositions;
    const currCoord = props.currCoord;

    const gpsMode=props.gpsMode;
    const setGpsMode=props.setGpsMode;

    const parkList=props.parkList;

    const typeList=props.typeList;
    const typeListIdx=props.typeListIdx;

    const navToCoord=props.navToCoord;
    const setNavToCoord=props.setNavToCoord;

    const [region,setRegion]=useState({
        latitude: currCoord.latitude-0.0008,
        longitude: currCoord.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
        });
    const [fillColorPicker,setFillColorPicker]=useState(["rgba(0, 200, 0, 0.5)","rgba(200, 0, 0, 0.5)","rgba(0, 0, 200, 0.5)","rgba(200, 200, 0, 0.5)"]);
    
    const [parkRegion,setParkRegion]=useState()
    /* Map Animation */
    //mapViewRef use to animate object
    const mapViewRef=useRef(null);

    /**
     * Animates to Specific region whenever currCoord/gpsMode Changes 
     */
    useEffect(()=>{
        setRegion({
            latitude: currCoord.latitude-0.0008,
            longitude: currCoord.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
            })
        if(gpsMode=="track"){
            console.log('useEffect1 '+gpsMode)
            console.log('useEffect1 '+region)
            mapViewRef.current.animateToRegion(
            region,200
            )
        }

    },[currCoord,gpsMode])

    useEffect(()=>{
        if(navToCoord!=null){
            console.log("In Map"+navToCoord.latitude)
            //console.log(parkpoly["ADMIRALTY PK"])
            setParkRegion({
                latitude: navToCoord.latitude-0.0010,
                longitude: navToCoord.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
                })

            setGpsMode("explore")
            // //filterPolygon();
            // //console.log(parkpoly["ADMIRALTY PK"]);
            // if(props.gpsMode=="track"){
            //     console.log('useEffect1 '+props.gpsMode)
            //     console.log('useEffect1 '+region)
            //     mapViewRef.current.animateToRegion(
            //     region,200
            //     )
            // }
        }
        

    },[navToCoord])


    useEffect(()=>{
        if(navToCoord!=null){

            console.log("Moving Now"+navToCoord.latitude)
            mapViewRef.current.animateToRegion(parkRegion,500)
            setGpsMode("explore")
            // //filterPolygon();
            // //console.log(parkpoly["ADMIRALTY PK"]);
            // if(props.gpsMode=="track"){
            //     console.log('useEffect1 '+props.gpsMode)
            //     console.log('useEffect1 '+region)
            //     mapViewRef.current.animateToRegion(
            //     region,200
            //     )
            // }
        }
        

    },[parkRegion])
    return (
        <View style={styles.componentContainer}>
            <MapView 
                style={styles.map}
                ref = {mapViewRef}

                initialRegion={{
                latitude: currCoord.latitude-0.0008,
                longitude: currCoord.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
                }}
                onRegionChangeComplete={(region, gesture) => {
                    //console.log('user move map')
                    if(gesture.isGesture){
                        setGpsMode("explore")
                        console.log('user move map'+(gpsMode=="explore"))
                    }else{
                        console.log('animate move map '+gesture)
                    }
                }}
                >
                <Polyline
                    coordinates={mapPositions}
                    strokeWidth={5}
                    strokeColor={'#7289DA'}
                />
                <Circle 
                    center={currCoord}
                    radius={10}
                    fillColor={'#7289DA'}
                    strokeWidth={0}
                    zIndex={1}
                />
                <Circle 
                    center={currCoord}
                    radius={15}
                    fillColor={'#ddddff'}
                    strokeWidth={0}
                />
                {/* <Polygon
                        coordinates={props.parkList[0].polygon}
                        fillColor={fillColorPicker[index]}
                        strokeColor="rgba(0,0,0,0.5)"
                        strokeWidth={2}
                        tappable={true}
                        onPress={() => { props.setNavToCoord({latitude:item.geometry.location.lat,longitude:item.geometry.location.lng});}}
                /> */}
                {parkList.map((item,index)=>{return (((item.polygon!=null) && (typeList[typeListIdx].name=="SPACE"))?
                    <Polygon
                        coordinates={item.polygon}
                        fillColor={fillColorPicker[index]}
                        strokeColor="rgba(0,0,0,0.5)"
                        strokeWidth={2}
                        tappable={true}
                        onPress={() => { setNavToCoord({latitude:item.geometry.location.lat,longitude:item.geometry.location.lng});}}
                    />:
                    <></>)
                })}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    componentContainer:{
        width: width,
        height: height * 0.73,
    },
    map: {
        width: width,
        height: height * 0.73,
      },
});

export default AlphaRunMap;
