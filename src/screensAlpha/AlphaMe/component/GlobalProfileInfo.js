import React, { useState, useEffect } from 'react';
import { StyleSheet,  Text,  View, Dimensions, TouchableOpacity, Image } from 'react-native';
import * as Firestore from '../../../api/firestore';

import ViewProfilePicture from './ViewProfilePicture';

const {width, height} = Dimensions.get("window")

/**
 * This is a functional component representing Information available for view to everyone.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const GlobalProfileInfo = (props) => {
    const userData = props.userData;
    const [displayName, setDisplayName] = useState(userData.displayName);
    const [displayPicture, setDisplayPicture] = useState({uri: ""});
    const [description, setDescription] = useState(userData.description);
    const [uid, setUID] = useState(userData.uid);

    /**
     * This is a render effect based on "userData" state.
     */
    useEffect(() => {
        setDisplayName(userData.displayName);
        setUID(userData.uid);
        setDescription(userData.description);
    }, [userData]);

    /**
     * This is a constant render effect based upon component changes.
     */
    useEffect(() => {
        Firestore.storage_retrieveProfilePic(setDisplayPicture, () => setDisplayPicture({uri:"https://images.unsplash.com/photo-1474978528675-4a50a4508dc3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHByb2ZpbGV8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"}));
    })

    const [toggleImage, setToggleImage] = useState(false);

    return (
        <View style={styles.componentContainer}>

            {/* Profile Picture */}
            <TouchableOpacity style={styles.profilePicContainer} onPress={() => setToggleImage(true)}>
                {(displayPicture.uri != "") &&
                    <Image style={styles.profilePicContainer} source={displayPicture} />
                } 
            </TouchableOpacity>

            {/* View Profile Picture */}
            <ViewProfilePicture
                toggleImage={toggleImage}
                setToggleImage={setToggleImage}
                displayPicture={displayPicture}
            />

            {/* User Info */}
            <View style={styles.infoContainer}>
                <View style={styles.nameContainer}>
                    <Text style={styles.nameText} numberOfLines={1}>{displayName}</Text>
                </View>
                <View style={styles.idContainer}>
                    <Text style={styles.idText} numberOfLines={1}>ID: {uid}</Text>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>
                        {description}
                    </Text>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    componentContainer:{
        width: width,
        height: height * 0.20,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        // backgroundColor: '#4F535C',
    },
    profilePicContainer:{
        height: height * 0.15,
        aspectRatio: 1,
        borderRadius: width,
        backgroundColor: '#4F535C',
    },
    infoContainer:{
        width: (width * 0.95) - (height * 0.15) - (width * 0.05),
        height: height * 0.22,
        justifyContent: 'space-between',
        // backgroundColor: 'green',
    },
    nameContainer:{
        width: (width * 0.95) - (height * 0.15) - (width * 0.05),
        height : height * 0.10,
        paddingHorizontal: width * 0.020,
        justifyContent: 'flex-end',
        // backgroundColor: 'red',
    },
    nameText:{
        fontWeight: 'bold',
        fontSize: 18,
        color: '#FFFFFF',
    },
    idContainer:{
        width: (width * 0.95) - (height * 0.15) - (width * 0.05),
        height : height * 0.020,
        paddingHorizontal: width * 0.020,
        justifyContent: 'flex-start',
        // backgroundColor: 'orange',
    },
    idText:{
        fontSize: 10,
        color: '#BABBBF',
    },
    descriptionContainer:{
        width: (width * 0.95) - (height * 0.15) - (width * 0.05),
        height : height * 0.13,
        paddingHorizontal: width * 0.025,
        // backgroundColor: 'yellow',
    },
    descriptionText:{
        fontSize: 14,
        color: '#FFFFFF',
    },
});

export default GlobalProfileInfo;