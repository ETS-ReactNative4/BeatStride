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
const FriendItem = (props) => {
    const navigation = useNavigation();
    const item = props.item;
    const uid = item.uid;

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
                //console.log(userData)
            },
            (error) => {console.log(error)},
        );
        Firestore.storage_retrieveOtherProfilePic(uid, setDisplayPicture, () => {});
    }, [])

    return (
        <TouchableOpacity onPress={() => { }}>
            <View style={styles.componentContainer}>

                {/* profile image */}
                <View style={styles.pictureContainer}>
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
                    <View style={styles.idContainer}>
                        <Text style={styles.idText} numberOfLines={1}>{uid}</Text>
                    </View>
                    
                </View>
                {(true)?
                <View style={{...styles.notifyDot, backgroundColor: empty ? "transparent" : "red",borderRadius:height}}>
                    <Image style={{flex: 1,resizeMode: 'contain',width: width * 0.08,aspectRatio: 1,borderRadius:height}} source={displayPicture}/>
                </View>
                :
                <></>}
                

            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    componentContainer:{
        width: width*0.4,
        height: height * 0.05,
        flexDirection: 'row',
        alignItems: 'flex-start',
        //paddingLeft: width * 0.05,
        // justifyContent: 'space-around',
        backgroundColor: 'purple',
        // borderColor: '#FFFFFF',
        // borderWidth: 1,
    },
    pictureContainer:{
        height: height * 0.05,
        aspectRatio: 1,
        borderRadius: height,
        backgroundColor: '#4F535C',
    },
    dataContainer:{
        height: height * 0.05,
        width: width * 0.9 - (height * 0.15)-30,
        marginLeft: width * 0.0,
        justifyContent: 'center',
        backgroundColor: 'grey',
    },
    nameContainer:{
        height: height * 0.025,
        width: width * 0.6 - (height * 0.08),
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        backgroundColor: 'green',
    },
    nameText:{
        fontWeight: 'bold',
        fontSize: 10,
        color: '#FFFFFF',
    },
    idContainer:{
        height: height * 0.025,
        width: width * 0.7 - (height * 0.08),
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'blue',
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

export default FriendItem;
