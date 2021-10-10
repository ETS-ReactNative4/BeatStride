import React,{useRef,useEffect,useState} from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Polyline, Circle } from 'react-native-maps';

const {width, height} = Dimensions.get("window")


/**
 * This is a functional component representing the Map display with route traced during a run.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const AlphaRunMap = (props) => {
    const runStatus = props.runStatus;
    const mapPositions = props.mapPositions;
    const currCoord = props.currCoord;

    const [region,setRegion]=useState({
        latitude: currCoord.latitude-0.0008,
        longitude: currCoord.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
        });

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
        if(props.gpsMode=="track"){
            console.log('useEffect1 '+props.gpsMode)
            console.log('useEffect1 '+region)
            mapViewRef.current.animateToRegion(
            region,200
            )
        }

    },[currCoord,props.gpsMode])


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
                        props.setGpsMode("explore")
                        console.log('user move map'+(props.gpsMode=="explore"))
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
