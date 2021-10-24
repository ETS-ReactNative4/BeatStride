import React, { useState, useEffect } from 'react';
import { StyleSheet,  Text,  View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Firestore from '../../../api/firestore';

const {width, height} = Dimensions.get("window")


/**
 * This is a functional component representing a friend object.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const FriendItemHoriParticipant = (props) => {
    const navigation = useNavigation();
    const item = props.item;
    const uid = item.uid;
    const status=item.status;
    const creatorUID=item.creator;

    const [displayName, setDisplayName] = useState('');
    const [displayPicture, setDisplayPicture] = useState({uri: ""});
    const [userData, setUserData] = useState({});



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
    //console.log(defaultDisplayPicture+" number  ../../../assets/icons/DefaultProfile/pfp"+ num)

    const [empty, setEmpty] = useState(false);

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
                // console.log(userData)
            },
            (error) => {console.log(error)},
        );
        Firestore.storage_retrieveOtherProfilePic(uid, setDisplayPicture, () => {});
    }, [])

    return (
        <TouchableOpacity 
            
            onLongPress={()=>{
                console.log("LONG PRESSSSS")
                if(uid!==creatorUID){
                    Firestore.db_deleteFriendFromGame(uid)
                }
                }}>
            <View style={styles.componentContainer}>
                
                {/* profile image */}
                <View style={{...styles.pictureContainer,marginTop:5}}>
                    { (displayPicture.uri != "") &&
                        <Image style={{...styles.pictureContainer,borderRadius:height,borderColor:(status=='request')?'purple':((status=='decline')?'red':'green'),borderWidth:(status=='request')?3:3}} source={displayPicture} />
                    }
                </View>
                <View style={{...styles.notifyDot, backgroundColor: empty ? "transparent" : "red",borderRadius:height,overflow:'hidden'}}>
                    <Image style={{flex: 1,resizeMode: 'contain',width: width * 0.05,aspectRatio: 1}} source={displayPicture}/>
                </View>
                
                {/* Data Container */}
                <View style={styles.dataContainer}>

                    {/* Display name */}
                    <View style={styles.nameContainer}>
                        <Text style={styles.nameText} numberOfLines={1}>{(displayName.length>4)?(displayName.slice(0,4)+"..."):(displayName)}</Text>
                        <Text style={{...styles.nameText,fontSize:9,borderRadius:5,backgroundColor:(status=='request')?'purple':((status=='decline')?'red':'green')}} numberOfLines={1}>{(status==null)?"request":status}</Text>
                    </View>
                    
                </View>

            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    componentContainer:{
        height: height * 0.160-6,
        width: height * 0.12-6,
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'space-around',
        // backgroundColor: 'purple',
        // borderColor: '#FFFFFF',
        //borderWidth: 1,
        borderRadius:6,
        backgroundColor:"#1C2222",
        margin:3,
    },
    pictureContainer:{
        height: height * 0.1,
        aspectRatio: 1,
        borderRadius: height,
        backgroundColor: '#4F535C',
        //
    },
    dataContainer:{
        height: height * 0.060-3,
        justifyContent: 'center',
        // backgroundColor: 'red',
        borderColor: 'red',
        //borderWidth: 1,
    },
    nameContainer:{
        height: height * 0.060-3,
        width: height * 0.12-6,
        overflow:'hidden',
        //borderRadius:6,
        //justifyContent: 'center',
        //backgroundColor: 'purple',
        marginLeft:3,
        marginRight:3,
    },
    nameText:{
        fontWeight: 'bold',
        fontSize: 11,
        color: '#FFFFFF',
        //backgroundColor:'blue',
        textAlign:'center',
        marginLeft:3,
        marginRight:3,

    },
    idContainer:{
        height: height * 0.04,
        width: width * 0.7 - (height * 0.08),
        justifyContent: 'center',
        alignItems: 'flex-start',
        // backgroundColor: 'blue',
    },
    idText:{
        fontSize: 10,
        color: '#BABBBF',
    },
    notifyDot:{
        position: 'absolute',
        top: width * 0.01,
        right: width * 0.01,
        width: width * 0.05,
        aspectRatio: 1,
        borderRadius: width,
        resizeMode:'contain'

    },
})

export default FriendItemHoriParticipant;
