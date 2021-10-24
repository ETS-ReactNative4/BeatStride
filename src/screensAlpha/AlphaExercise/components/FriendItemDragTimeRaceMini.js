import React, { useState, useEffect } from 'react';
import { StyleSheet,  Text,  View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Firestore from '../../../api/firestore';
import Animated,{
    useSharedValue,
    useAnimatedStyle, 
    withSpring,
} from 'react-native-reanimated';

//Constants
const {width, height} = Dimensions.get("window")
const itemHeight=height * 0.06;

/**
 * This is a functional component representing a friend object.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const FriendItemDragTimeRaceMini = (props) => {
    const navigation = useNavigation();
    
    //Changes When prop changes
    const item = props.item;
    const uid = item.uid;
    const friendList=props.friendList;
    const selfID=props.selfID;
 
    // const addedFriendList=props.addedFriendList;
    // const setAddedFriendList=props.setAddedFriendList;

    //Set when prop is first rendered
    const [displayName, setDisplayName] = useState('');
    const [displayPicture, setDisplayPicture] = useState({uri: ""});
    const [userData, setUserData] = useState({});
    const [startItem, setStartItem] = useState({});
    

    const [num,setNum]=useState(Math.floor(Math.random() * 10))
    const [defaultDisplayPicture, setDefautDisplayPicture]=useState({0:require('../../../assets/icons/DefaultProfile/pfp0.png'),
    1:require('../../../assets/icons/DefaultProfile/pfp1.png'),
    2:require('../../../assets/icons/DefaultProfile/pfp2.png'),
    3:require('../../../assets/icons/DefaultProfile/pfp3.png'),
    4:require('../../../assets/icons/DefaultProfile/pfp4.png'),
    5:require('../../../assets/icons/DefaultProfile/pfp5.png'),
    6:require('../../../assets/icons/DefaultProfile/pfp6.png'),
    7:require('../../../assets/icons/DefaultProfile/pfp7.png'),
    8:require('../../../assets/icons/DefaultProfile/pfp8.png'),
    9:require('../../../assets/icons/DefaultProfile/pfp9.png')})

    const [empty, setEmpty] = useState(false);

    //For Reordering List
    const [moving, setMoving] = useState(true);
    const top=useSharedValue(0);

 


    /**
     * This is a render effect triggered upon component mount.
     */
         useEffect(() => {
            setDisplayPicture(defaultDisplayPicture[num])
            // console.log(uid)
            Firestore.db_getOtherDataSnapshot(
                uid,
                (userData) => {
                    setUserData(userData)
                    setDisplayName(userData.displayName)
                    //console.log(userData)
                },
                (error) => {console.log(error)},
            );
            Firestore.storage_retrieveOtherProfilePic(uid, setDisplayPicture, () => {});
            setStartItem(item);
        }, [])

    
    /**
     * This is a render effect triggered upon props.newPosition change.
     */
        useEffect(() => {
            
               if(userData!=null){
                if( props.newPositions[userData.uid]!=null){
                        //console.log("DisplayName "+displayName+" new Pos " +props.newPositions[userData.uid]+" old position "+props.positions[userData.uid]+ " top "+top.value/(height*0.15))
        
                        //console.log(userData.displayName+" " +props.newPositions[userData.uid])
                        top.value=withSpring(props.newPositions[userData.uid]*itemHeight,{
                            duration:1000
                        });
                }
            }
        }, [props.newPositions])
    
    /**
     * This an Animated Style.
     */
    const animatedStyle=useAnimatedStyle(()=>{
        return{
            position:'absolute',
            left:0,
            right:0,
            width: width,
            height: itemHeight,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: width * 0.05,
            top: top.value,
            zIndex:moving?1:0,
            shadowColor:'black',
            shadowOffset:{
                height:0,
                width:0,
            },
            shadowOpacity: withSpring(moving?0.2:0),
            shadowRadius:10,
        }
    },[props.newPositions]);
    

    return (
        <Animated.View style={animatedStyle}>

            <TouchableOpacity onPress={() => { }}>
                <Animated.View>
                    <View style={{...styles.componentContainer}}>

                        {/* profile image */}
                        <View style={{...styles.pictureContainer,borderWidth:(selfID==userData.uid)?2:0,borderColor:(selfID==userData.uid)?"blue":"",overflow:'hidden'}}>
                            { (displayPicture.uri != "") &&
                                <Image style={styles.pictureContainer} source={displayPicture} />
                            }
                        </View>

                        {/* Data Container */}
                        <View style={styles.dataContainer}>

                            {/* Display name */}
                            <View style={styles.nameContainer}>
                                <Text style={styles.nameText} numberOfLines={1}>{displayName}</Text>
                            </View>

                            {/* User id */}
                            <View style={styles.nameContainer}>
                                <Text style={styles.nameText} numberOfLines={1}>{friendList.length!=0&& friendList.findIndex(item=>{return item.uid===userData.uid})>=0?(friendList[friendList.findIndex(item=>{return item.uid===userData.uid})].measurement/ 1000).toFixed(2):userData.uid}KM</Text>
                            </View>
                        </View>

                        <View style={{...styles.notifyDot, backgroundColor: empty ? "transparent" : "red",borderRadius:height}}>
                            <Image style={{flex: 1,resizeMode: 'contain',width: width * 0.08,aspectRatio: 1,borderRadius:height}} source={displayPicture}/>
                        </View>


                    </View>
                </Animated.View>
            
            </TouchableOpacity>
        </Animated.View>
        
    );
};

const styles = StyleSheet.create({
    componentContainer:{

        width: width*0.44,
        height: itemHeight-4,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: width * 0.01,
        // justifyContent: 'space-around',
        // backgroundColor: 'purple',
        // borderColor: '#FFFFFF',
        // borderWidth: 1,
        backgroundColor: 'rgba(113, 137, 218, 0.8)',
        borderRadius:10,
        margin:2,
    },
    pictureContainer:{
        height: height * 0.05,
        aspectRatio: 1,
        borderRadius: height,
        backgroundColor: '#4F535C',
        resizeMode:'contain'
    },
    dataContainer:{
        height: height * 0.05,
        width: width * 0.2,
        marginLeft: width * 0.01,
        justifyContent: 'center',
        //backgroundColor: 'grey',
    },
    nameContainer:{
        height: (itemHeight-4)/2,
        width: width * 0.3 - (height * 0.08),
        justifyContent: 'center',
        alignItems: 'flex-start',
        //backgroundColor: 'green',
        //borderWidth:1,
    },
    nameText:{
        fontWeight: 'bold',
        fontSize: 13,
        color: '#FFFFFF',
        //backgroundColor: 'yellow',
        textAlign:'center',
        textAlignVertical:'center',
        
    },
    idContainer:{
        height: height * 0.04,
        width: width * 0.3 - (height * 0.08),
        justifyContent: 'center',
        alignItems: 'flex-start',
        // backgroundColor: 'blue',

    },
    idText:{
        fontSize: 10,
        color: '#BABBBF',
    },
    notifyDot:{

        width: width * 0.08,
        aspectRatio: 1,
        borderRadius: width,
        resizeMode:'contain',
        backgroundColor:'brown'

    },
})

export default FriendItemDragTimeRaceMini;
