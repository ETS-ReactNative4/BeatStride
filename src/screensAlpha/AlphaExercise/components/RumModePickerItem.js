import React, { useState, useEffect } from 'react';
import { Text,Image,View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import * as Location from 'expo-location';
// import PlaylistSelectionBasic from '../PlaylistSelectionBasic';
// import SelectLoading from './SelectLoading';
import { TouchableOpacity } from 'react-native-gesture-handler';

const {width, height} = Dimensions.get("window")

/**
 * This is a functional component representing the Basic run on Run Tab on the Exercise page.
 * 
 * @author NTU CZ2006 Team Alpha
 */
 
 const RunModePickerItem = (props) => {

    const itemList=props.itemList;
    const itemIdx=props.itemIdx;
    const setItemIdx=props.setItemIdx;
    const title=props.title;

    console.log("IN PICKER "+itemList)



    const arraylooper=()=>{
        if (itemIdx<itemList.length-1){
            setItemIdx(itemIdx+1)
        }else{
            setItemIdx(0)
        }

    }
    
    return (
        <View style={styles.innercomponentContainer}> 
            <TouchableOpacity style={styles.startButton} onPress={()=>{arraylooper()}}>
                <View>
                    <Image 
                        source={itemList[itemIdx].iconSRC}
                        resizeMode= 'contain'
                        style={styles.startIcon}
                    />
                    {/* <Text>Centered View</Text> */}
                </View>
            </TouchableOpacity>
            <View style={styles.innerTextContainer}>
            
                {/* Text */}
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                    
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>{itemList[itemIdx].name}</Text>
                </View>
            </View>
        
        
    </View>
    );
  }

const styles = StyleSheet.create({
    innercomponentContainer:{
        justifyContent: 'center', 
        backgroundColor:'#4F535C',//default
        //backgroundColor:'yellow', 
        paddingLeft: width * 0.7 * 0.02,
        alignSelf:'flex-start',

        flexDirection:'row',
        alignContent:'flex-start',
        width: width * 0.475-1,
        height: height * 0.1, 
        overflow:'hidden'
        //borderBottomWidth: 1,
        //borderRightWidth:1,
        //borderBottomColor:'#bfbfbf',
        //borderRightColor:'#bfbfbf',
        //borderTopLeftRadius:10
    }, 
    innerTextContainer:{
        justifyContent: 'center', 
        backgroundColor: '#4F535C', 
        alignSelf:'flex-start',
        
        width: width * 0.3,
        height: height * 0.095, 
        //backgroundColor:'pink', //Test
    }, 
    titleContainer:{
        width: width * 0.25,
        height: height * 0.04,
        justifyContent:'center',
        alignSelf:'flex-start',
        alignItems:'flex-start',
        paddingLeft: width * 0.7 * 0.02,
        paddingTop: height * 0.04 * 0.3,

        //backgroundColor: 'green',//Test
        alignItems:'flex-start'
    },
    titleText:{
        fontWeight: 'bold',
        fontSize: 12,
        color: '#BABBBF',
        //backgroundColor: 'grey',//Test
    },
    descriptionContainer:{
        width: width * 0.25,
        height: height * 0.055,
        alignSelf:'flex-start',
        alignItems:'flex-start',
        justifyContent:'center',
        paddingLeft: width * 0.7 * 0.02,
        //backgroundColor: 'purple',//Test
    },
    descriptionText:{
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
        //backgroundColor: 'grey',//Test
    },
    startButton:{
        height: height * 0.095,
        aspectRatio: 1,
        //borderRadius: height,
        // position: 'absolute',
        // right: ((width * 0.95) - (width * 0.65) - (height * 0.1)) * 0.5,
        // top:500,
        // right: 0,
        // top:0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4F535C',
        //MarginLeft:width * 0.7 * 0.02,
        //borderWidth: 5,
    },
    startIcon:{
        height: height * 0.065,
        aspectRatio: 1,
        transform: [{translateY: width * 0.01}],
        tintColor: '#7289D9',
    },
    
})

export default RunModePickerItem;
