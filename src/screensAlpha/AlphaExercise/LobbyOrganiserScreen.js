import React, { useState, useEffect } from 'react';
import { SafeAreaView,  StyleSheet,  Text,  View, Dimensions, FlatList, Keyboard , Image, TouchableOpacity} from 'react-native';
import { TextInput } from "react-native-paper";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import * as Firestore from '../../api/firestore';
import Picker from '@gregfrench/react-native-wheel-picker'
import FriendItem from './components/FriendItem';
import FriendItemHori from './components/FriendItemHori';
import FriendItemHoriParticipant from './components/FriendItemHoriParticipant';
import moment from 'moment';

var PickerItem = Picker.Item;

const {width, height} = Dimensions.get("window")


/**
 * This is a functional component representing the search screen where users can
 * search for other users.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const LobbyOrganiserScreen = ({navigation, route}) => {
    const [selfID, setSelfID] = useState('')
    const [data, setData] = useState([])
    const [search, setSearch] = useState('Tes');
    const [searchResults, setSearchResults] = useState([]);
    const [friendList , setFriendList] = useState([]);
    const [friendListFireStore , setFriendListFireStore] = useState([]);
    //Added List
    const [addedFriendList, setAddedFriendList] = useState([]);
    //Organiser Data
    const [displayName, setDisplayName] = useState('');
    const [displayPicture, setDisplayPicture] = useState({uri: ""});

    const time = moment.duration(0);
    const [hour, setHour] = useState();
    const [min, setMin] = useState();
    const [sec, setSec] = useState();
    const [overallTime,setOverallTime]=useState(time);
    const [overallTimeString,setOverallTimeString]=useState('');
    const [distanceKM,setDistanceKM]=useState();
    const [distanceM,setDistanceM]=useState();
    const [distance, setDistance] = useState();
    const [chooseState, setChooseState] = useState(route.params.chooseState);

    const [raceParam,setRaceParam]=useState('Distance')

    const [empty,setEmpty]=useState(true)

    /**
     * This helper method is a comparator to compare the keyword in the search bar to the displayName field in the userData.
     * @param {Object} userData     A object which contains the user information retrieved from Firestore.
     * @returns A boolean result based on string comparison.
     */
    const searchMatch = (userData) => {
        const displayName = userData.displayName.toLowerCase()
        const uid = userData.uid.toLowerCase()
        const keyword = search.toLowerCase()

        return (displayName.includes(keyword)) || (uid.includes(keyword))
    }

    /**
     * This is a helper method to filter the user based on uid from the search results.
     * @param {Object} userData     A object which contains the user information retrieved from Firestore.
     * @returns A boolean result based on string comparison.
     */
    const filterSelf = (userData) => {
        const uid = userData.uid
        return !(uid === selfID);
    }

    /**
     * This is a render effect triggered upon component mount.
     * This retreives all the user information from Firestore.
     */
    useEffect(() => {
        // Firestore.db_userList(
        //     (userList) => { setData(userList) 

        //     },
        //     (error) => { console.log(error) },
        // )
        
        Firestore.db_friendsList(
            (userList) => {
                setFriendList(userList)
                console.log(userList)
                // console.log(userList)
            },
            (error) => {console.log(error)},
        )


        Firestore.db_getUserDataSnapshot(
            (userData) => { 
                setSelfID(userData.uid); 
                //setUserData(userData)
                setDisplayName(userData.displayName)
                // console.log(userData.uid);
            },
            (error) => { console.log(error) },
        )


        // Firestore.db_requestList(
        //     (userList) => {
        //         if (userList.length == 0) {
        //             setEmpty(true);
        //         } else {
        //             setEmpty(false);
        //         }  
        //     },
        //     (error) => {console.log(error)},
        // )
        
    }, [])

    useEffect(() => {
        Firestore.storage_retrieveOtherProfilePic(selfID, setDisplayPicture, () => setDisplayPicture({uri: ""}));
        Firestore.db_gameRoomParticipantListonSnapShot(
            "game"+selfID
            ,(userList) => {
                if(userList.length!=0){
                    var self=userList[userList.findIndex(item => item.uid==selfID)]
                    // console.log("Self")
                    // console.log(userList[userList.findIndex(item => item.uid==selfID)])
                    // console.log("Filtered")
                    // console.log(userList.filter(filterSelf))
                    // console.log("Recombined")
                    // console.log([self,...userList.filter(filterSelf)])
                    setFriendListFireStore([self,...userList.filter(filterSelf)])
                    setFriendListFireStore([userList[userList.findIndex(item => item.uid==selfID)],...userList.filter(filterSelf)])
                    // console.log("USER LIST"+userList+".........................")
                    // console.log(userList)
                    // console.log(userList)
                }
                
            },
            (error) => {console.log(error)},
        ) 
    }, [selfID])

    /**
     * This is a render effect based on "search" state.
     */
    // useEffect(() => {
    //     if (search == "") {
    //         setSearchResults([])
    //     } else {
            
    //         const searchList = data.filter(filterSelf)
    //         setSearchResults(searchList.filter(searchMatch))
    //     }
    // }, [search])

    useEffect(() => {
        setOverallTime( moment.duration(0).add(min,'m').add(sec,'s').add(hour,'h'))
    }, [min,sec,hour])
    useEffect(() => {
        setOverallTimeString(moment.utc(overallTime.as('milliseconds')).format('HH:mm:ss'));
        console.log("TIME SET"+ moment.utc(overallTime.as('milliseconds')).format('HH:mm:ss'))
    }, [overallTime])

    useEffect(() => {
        setDistance( distanceKM*1000+distanceM)
    }, [distanceKM,distanceM])
    useEffect(() => {
        console.log("Distance SET"+ distance)
    }, [distance])

    const sentInvite=()=>{
        setChooseState(false)

        Firestore.db_requestFriendtoGame( selfID ,raceParam, distance, overallTimeString)
        for (var i=0;i<addedFriendList.length;i++) {
            if(!addedFriendList.some(item=>item.uid===friendListFireStore[i].uid )){
                Firestore.db_requestFriendtoGame( addedFriendList[i].uid ,raceParam, distance, overallTimeString)
            }
        }

        for (var i=0;i<friendListFireStore.length;i++){

            if(!addedFriendList.some(item=>item.uid===friendListFireStore[i].uid )){
                if(!(friendListFireStore[i].uid===selfID)){
                    console.log(friendListFireStore[i].uid+" is not here")
                    Firestore.db_deleteFriendFromGame(friendListFireStore[i].uid)
                    
                }
                
            }

        }


        // () => {
        //     Firestore.db_requestFriend(userData.uid);
        //     setStatus("pending");
        // }
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={{height:0.12*height, flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{height:0.12*height, flexDirection:'column', justifyContent:'space-between'}}>
                    <Text style={{...styles.timeLabel,paddingLeft: width * 0.02,}}>Organiser</Text>
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
                                <Text style={styles.idText} numberOfLines={1}>{selfID.substring(0, 15)+"..."}</Text>
                            </View>
                            
                        </View>

                    </View>
                </View>
                
                <View style={styles.timeComponent}>

                    {/* Hour */}
                    <View style={styles.timeContainer}>
                        <TouchableOpacity onPress={() => {(chooseState==true)?((raceParam=='Distance')?setRaceParam('Time'):setRaceParam('Distance')):{} }}>
                            <View style={{width: width*0.40, borderRadius: 20,overflow:'hidden',justifyContent:'center'}}>
                                <Text style={{...styles.timeLabel,backgroundColor: (chooseState==true)?'#7289D9':'transparent',textAlign:'center',}}>{raceParam}</Text>
                            </View>

                        </TouchableOpacity> 
                        
                        {(raceParam=='Time')?
                        <Text>
                            <View style={styles.scrollPickerContainer}>
                                
                                <Picker style={styles.scrollPickerComponent}
                                    lineColor="#FFFFFF"
                                    selectedValue={hour}
                                    itemStyle={{color:"#FFFFFF", fontSize: 12}}
                                    onValueChange={(index) => setHour(index) }>
                                    {[...Array(24).keys()].map((value, i) => (
                                        <PickerItem label={value.toString()} value={i} key={i}/>
                                    ))}
                                </Picker>
                                <Text style={{color: '#BABBBF'}}>:</Text>
                                <Picker style={styles.scrollPickerComponent}
                                    lineColor="#FFFFFF"
                                    selectedValue={min}
                                    itemStyle={{color:"#FFFFFF", fontSize: 12}}
                                    onValueChange={(index) => setMin(index) }>
                                    {[...Array(24).keys()].map((value, i) => (
                                        <PickerItem label={value.toString()} value={i} key={i}/>
                                    ))}
                                </Picker>
                                <Text style={{color: '#BABBBF'}}>:</Text>
                                <Picker style={styles.scrollPickerComponent}
                                    lineColor="#FFFFFF"
                                    selectedValue={sec}
                                    itemStyle={{color:"#FFFFFF", fontSize: 12}}
                                    onValueChange={(index) => setSec(index) }>
                                    {[...Array(24).keys()].map((value, i) => (
                                        <PickerItem label={value.toString()} value={i} key={i}/>
                                    ))}
                                </Picker>
                            </View>
                        </Text>
                        :
                        <Text>
                        <View style={styles.scrollPickerContainer}>
                            <Picker style={styles.scrollPickerComponent}
                                lineColor="#FFFFFF"
                                selectedValue={distanceKM}
                                itemStyle={{color:"#FFFFFF", fontSize: 12}}
                                onValueChange={(index) => setDistanceKM(index) }>
                                {[...Array(65).keys()].map((value, i) => (
                                    <PickerItem label={value.toString()} value={i} key={i}/>
                                ))}
                            </Picker>
                            <Text style={{color: '#BABBBF'}}>.</Text>
                            <Picker style={styles.scrollPickerComponent}
                                lineColor="#FFFFFF"
                                selectedValue={distanceM}
                                itemStyle={{color:"#FFFFFF", fontSize: 12}}
                                onValueChange={(index) => setDistanceM(index*100) }>
                                {[...Array(9).keys()].map((value, i) => (
                                    <PickerItem label={value.toString()} value={i} key={i}/>
                                ))}
                            </Picker>
                            <Text style={{color: '#BABBBF'}}>KM</Text>
                        </View>
                    </Text>
                        
                        }
                        {(chooseState==false)?
                            <View style={{...styles.scrollPickerContainer,  borderColor: 'transparent', borderWidth: 0,position: 'absolute',backgroundColor:'transparent',top: width * 0.045,right: width * 0.005,}}></View>
                        :
                        <></>
                        }
                    </View>
                </View>

            </View>
            <Text style={{...styles.timeLabel,fontSize:14,paddingLeft: width * 0.02,}}>Warning: Runsafely and obey traffic laws</Text>
            
            {/*Chosen List*/}
            {(chooseState==true)?
            
                <View style={{width: width, height: height * 0.145,borderWidth:5, flexDirection:'row'}}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator ={false}
                        style={styles.list2}

                        data={addedFriendList}
                        keyExtractor={item => item.uid}
                        renderItem={({item}) => <FriendItemHori item={item} 
                            
                            addedFriendList={addedFriendList} 
                            setAddedFriendList={(newList)=>setAddedFriendList(newList)}/>}
                        ListEmptyComponent={
                            <View style={styles.emptyList}>
                            </View>
                        }
                    />
                    <TouchableOpacity onPress={() => {sentInvite() }}>
                        <View style={{width: width*0.25, height: height * 0.145-18, borderRadius: 20, padding:4, margin: 5, backgroundColor: '#7289D9',justifyContent:'center'}}>
                            <Text style={{textAlign:'center', color:'white'}}>{addedFriendList.length}</Text>
                            <Text style={{textAlign:'center', color:'white'}}>Invite</Text>
                        </View>
                    </TouchableOpacity>
                </View>
    
            

            :
            <View style={{width: width, height: height * 0.145,flexDirection:'column', alignItems:'center',justifyContent:'space-around'}}>
                <TouchableOpacity onPress={() => {
                        //navigation.navigate("RunScreenAlpha", {mode: "Space"})
                        //navigation.navigate("LobbyOrganiserScreen2",{mode: "Time", chooseState:true})
                    }}>
                        <Text style={styles.startButtonColor}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                        setChooseState(true) 
                        //navigation.navigate("RunScreenAlpha", {mode: "Space"})
                    }}>
                        <Text style={{...styles.startButtonColor,backgroundColor:'transparent',borderWidth:3,borderColor:'#7289D9',}}>Edit Invite</Text>
                </TouchableOpacity>
            </View>
            }
            {/* Search Results */}
            {(chooseState==true)?
                
                <FlatList
                    showsVerticalScrollIndicator ={false}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    numColumns={1}
                    data={friendList}
                    keyExtractor={item => item.uid}
                    renderItem={({item}) => <FriendItem item={item}
                        addedFriendList={addedFriendList} 
                        setAddedFriendList={(newList)=>setAddedFriendList(newList)}/>}
                    ListEmptyComponent={
                        <View style={styles.emptyList}>
                            <View style={styles.emptyIcon}>
                                <FontAwesome name="search" size={height * 0.04} color="#72767D"/>
                            </View> 
                            <Text style={styles.emptyText}>Search for Users by</Text>
                            <Text style={styles.emptyText}>Name or ID</Text>
                        </View>
                    }
                />
                :
                <View style={{width: width*0.92, height: height * 0.560,borderWidth:5,borderColor:"purple", flexDirection:'row', alignSelf:'center', overflow:'hidden'}}>
                <FlatList
                    style={styles.list3}
                    numColumns={4}

                    data={friendListFireStore}
                    keyExtractor={item => item.uid}
                    renderItem={({item}) => <FriendItemHoriParticipant item={item} 
                        
                        addedFriendList={addedFriendList} 
                        setAddedFriendList={(newList)=>setAddedFriendList(newList)}/>}
                    ListEmptyComponent={
                        <View style={styles.emptyList}>
                        </View>
                    }
                />

        </View>
            }
            
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    //For Picker
    timeComponent: {
        width: width*0.5, 
        height: height * 0.2,
        paddingTop: height * 0.01,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        //alignItems: 'center',
        //backgroundColor: 'green',
    },
    timeContainer:{
        height: height * 0.10,
        width: width * 0.40,
        justifyContent: 'space-between',
        alignItems: 'center',
        //backgroundColor: 'pink',
    },
    scrollPickerContainer:{
        height: height * 0.08,
        width: width * 0.40,
        borderColor: '#72767D',
        borderWidth: 1,
        borderRadius:5 ,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'orange',
    },
    scrollPickerComponent:{
        height: height * 0.07,
        width: width * 0.10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
    },
    timeLabel:{
        fontWeight: 'bold',
        fontSize: 12,
        color: '#BABBBF'
    },

    //For Organiser content
    componentContainer:{
        width: width*0.5,
        height: height * 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: width * 0.02,
        // justifyContent: 'space-around',
        //backgroundColor: 'purple',
        // borderColor: '#FFFFFF',
        // borderWidth: 1,
    },
    pictureContainer:{
        height: height * 0.1,
        aspectRatio: 1,
        borderRadius: height,
        backgroundColor: '#4F535C',
    },
    dataContainer:{
        height: height * 0.1,
        width: width * 0.9 - (height * 0.1),
        marginLeft: width * 0.01,
        justifyContent: 'center',
        // backgroundColor: 'red',
    },
    nameContainer:{
        height: height * 0.04,
        width: width * 0.6 - (height * 0.08),
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        // backgroundColor: 'green',
    },
    nameText:{
        fontWeight: 'bold',
        fontSize: 16,
        color: '#FFFFFF',
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

    //For other content

    screen:{
        width: width,
        height: height,
        backgroundColor: '#282b30',
    },
    searchBar:{
        width: width,
        height: height * 0.13,
        alignItems: 'center',
        backgroundColor: 'pink',
    },
    list:{
        width: width,
        height: height * 0.5,
        backgroundColor: 'red',

    },
    list2:{
        width: width*0.75,
        height: height * 0.145,
        //backgroundColor: 'red',
        backgroundColor:'green'
    },
    list3:{
        //width: width*0.70,
        height: height * 0.735,
        //backgroundColor: 'red',
        backgroundColor:'pink',
  
    },
    listContent:{
        width: width,
        paddingBottom: height * 0.1,
        // backgroundColor: 'red',

    },
    emptyList: {
        width: width,
        height: height * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    emptyText:{
        fontSize: 14,
        color: '#72767D'
    },
    emptyIcon:{
        height: height * 0.07,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },

    startButtonColor:{
        width: width*0.95,
        height: height * 0.06,
        //backgroundColor:'red',
        textAlign:'center',
        fontWeight: 'bold',
        fontSize: 18,
        color:'white',
        borderRadius:height * 0.8,
        //paddingTop:height * 0.1*0.1,
        //alignSelf:'center'
        backgroundColor: '#7289D9',
    } ,
});

export default LobbyOrganiserScreen;
