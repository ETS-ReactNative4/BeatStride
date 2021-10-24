import React, { useState, useEffect } from 'react';
import { SafeAreaView,  StyleSheet,  Text,  View, Dimensions, FlatList, Keyboard , Image, TouchableOpacity,Alert,} from 'react-native';
import { TextInput } from "react-native-paper";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import * as Firestore from '../../api/firestore';
import Picker from '@gregfrench/react-native-wheel-picker'
import FriendItem from './components/FriendItem';
import FriendItemHoriParticipant from './components/FriendItemHoriParticipant';
import moment from 'moment';
import { CommonActions } from '@react-navigation/native'; 

var PickerItem = Picker.Item;

const {width, height} = Dimensions.get("window")


/**
 * This is a functional component representing the search screen where users can
 * search for other users.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const LobbyParticipantScreen = ({navigation, route}) => {
    const [selfID, setSelfID] = useState('')
    //const [data, setData] = useState([]) //Uncomment to get a larger List
    const [search, setSearch] = useState('Tes');
    const [searchResults, setSearchResults] = useState([]);
    const [friendList , setFriendList] = useState([]);
    //Added List
    const [addedFriendList, setAddedFriendList] = useState([]);


    //Organiser Data
    const [gameInviteData, setGameInviteData] = useState(route.params.gameInviteData);
    const [gameKey, setGameKey] = useState(route.params.gameInviteData.gameKey);
    const [organiserID, setOrganiserID] = useState(gameInviteData.creator);
    const [organiserData, setOrganiserData] = useState(gameInviteData.creator);
    const [displayName, setDisplayName] = useState(gameInviteData.organiser);
    const [displayPicture, setDisplayPicture] = useState({uri:"https://images.unsplash.com/photo-1474978528675-4a50a4508dc3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHByb2ZpbGV8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80"});

    const time = moment.duration(0);
    //const [overallTimeString,setOverallTimeString]=useState((gameInviteData.raceType=='Time')?gameInviteData.EndCondition :'');
    //const [overallTime,setOverallTime]=useState((gameInviteData.raceType=='Time')?moment(gameInviteData.EndCondition,'HH:mm:ss').format('HH:mm:ss'):time);
    //console.log("TIME END CONDITION"+moment(gameInviteData.EndCondition,'HH:mm:ss').hour() +":::"+"14/10/20 "+gameInviteData.EndCondition)
    
    const [hour, setHour] = useState(0);
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);
    
    
    const [distanceKM,setDistanceKM]=useState(0);
    const [distanceM,setDistanceM]=useState(0);
    
    const [distance, setDistance] = useState();
    const [chooseState, setChooseState] = useState(route.params.chooseState);

    const [raceParam,setRaceParam]=useState("Distance")

    const [empty,setEmpty]=useState(true)

    const [selfStatus, setSelfStatus] = useState("request");
    const [gameStatus, setgameStatus] = useState("request");
    const[allowBackState,setAllowBackState]=useState(0);


    useEffect(() => {

        if(allowBackState===0){
            console.log("no back")
        }
        if(allowBackState===1){
            console.log("back pressed")
            Alert.alert(
                "Leave Race",
                "Are you sure you want to leave the race? You will not be able to return unless the owner reinvites you.",
                [ { text:"Cancel", onPress: () => {
                    setAllowBackState(0);
                } }, 
                { text:"Confirm", onPress: () => {
                    declineInvite()
                    setAllowBackState(2);
                } }]
            )
        }
        if(allowBackState===2){
            console.log("Confirm Decline Invite")
            navigation.dispatch(CommonActions.reset({index: 0, routes: [{name: 'AppTab'}],}),);
        }
        if(allowBackState===3){
            Alert.alert(
                "Cancelled",
                "Owner has Cancelled the Race.",
                [ { text:"Understood", onPress: () => {
                    setAllowBackState(2);
                } }, ]
            )
            
        }
        if(allowBackState===4){
            console.log("gameStarted")
            navigation.navigate("AlphaTimeRace", {mode: "Time", gameKey:gameKey})
            
        }
        if(allowBackState===5){
            console.log("user Pressed Decline")
            Alert.alert(
                "Decline Race",
                "Are you sure you want to decline? You won't be able to return unless the owner reinvites you",
                [ { text:"Cancel", onPress: () => {
                    setAllowBackState(0);
                } }, 
                { text:"Confirm", onPress: () => {
                    declineInvite()
                    setAllowBackState(2);
                } }]
            )
            
        }



    }, [allowBackState])
    
    /**
     * This is a helper method to filter the user based on uid from the search results.
     * @param {Object} userData     A object which contains the user information retrieved from Firestore.
     * @returns A boolean result based on string comparison.
     */
    const filterSelf = (userData) => {
        const uid = userData.uid
        return !(uid === selfID);
    }
    useEffect(() => {
        if(selfStatus==="accept"&&gameStatus==="accept"){
            setAllowBackState(4);
            console.log('STARTTTTTTTTTTTTTT NOW GAMEEEEEEE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        }
        return () => {
            console.log("game Status Unmounted") // This worked for me
          };
    }, [selfStatus , gameStatus])

    /**
     * This is a render effect triggered upon component mount.
     * This retreives all the user information from Firestore.
     */
    useEffect(() => {


        Firestore.db_getUserDataSnapshot(
            (userData) => { 
                if(userData!=null){
                    setSelfID(userData.uid); 
                }
                
                //setUserData(userData)
                //setDisplayName(userData.displayName)
                // console.log(userData.uid);
            },
            (error) => { console.log(error) },
        )


        // console.log(uid)
        Firestore.db_getOtherDataSnapshot(
            organiserID,
            (userData) => {
                if(userData!=null){
                    setOrganiserData(userData)
                    setDisplayName(userData.displayName)
                }

                // console.log(userData)
            },
            (error) => {console.log(error)},
        );
        //Firestore.storage_retrieveOtherProfilePic(organiserID, setDisplayPicture, () => {});

        Firestore.db_requestList(
            (userList) => {
                if (userList.length == 0) {
                    setEmpty(true);
                } else {
                    setEmpty(false);
                }  
            },
            (error) => {console.log(error)},
        )
        return () => {
            console.log("SnapShot Unmounted") // This worked for me
          };
        
    }, [])

    useEffect(() => {
        if(selfID!=''){
            Firestore.db_gameRoomParticipantListonSnapShot(
                gameKey
                ,(userList) => {
                    if(userList.length!=0){
                        if(!userList.some(item=>item.uid===selfID )){
                            console.log("KICKEDOUT")
                            setAllowBackState(3)
                            setSelfStatus("request")
                        }
                        if(!userList.some(item=>item.uid===organiserID )){
                            console.log("KICKEDOUT")
                            setAllowBackState(3)
                            setSelfStatus("request")
                        }
                    }
                    var self=userList[userList.findIndex(item => item.uid==selfID)]
                    // console.log("Self")
                    // console.log(userList[userList.findIndex(item => item.uid==selfID)])
                    // console.log("Filtered")
                    // console.log(userList.filter(filterSelf))
                    // console.log("Recombined")
                    // console.log([self,...userList.filter(filterSelf)])
                    setFriendList([self,...userList.filter(filterSelf)])
                    //setFriendList([userList[userList.findIndex(item => item.uid==selfID)],...userList.filter(filterSelf)])
                    console.log(userList)
                    // console.log(userList)
                },
                (error) => {console.log(error)},
            ) 

            Firestore.db_gameRoomSettingsonSnapShot(
                gameKey
                ,(settings) => {
                    setHour((settings[0].raceType=='Time')?moment(settings[0].EndConditionTime,'HH:mm:ss').hour():0);
                    setMin((settings[0].raceType=='Time')?moment(settings[0].EndConditionTime,'HH:mm:ss').minutes():0);
                    setSec((settings[0].raceType=='Time')?moment(settings[0].EndConditionTime,'HH:mm:ss').seconds():0);
                    console.log()
                    setDistanceKM((settings[0].raceType=='Distance')?Math.floor(settings[0].EndConditionDistance/1000):0);
                    setDistanceM((settings[0].raceType=='Distance')?Math.floor(Math.floor(settings[0].EndConditionDistance%1000)/100):0);
                    setRaceParam(settings[0].raceType);
                    if( settings[0].status=="start"){
                        console.log('STARTTTTTTTTT STATUSSSSSSSSSS#############################################################################################################################################################################')
                        setgameStatus("accept");

                    }
                },
                (error) => {console.log(error)},
            ) 
        }
        return () => {
            console.log("SelfID Unmounted") // This worked for me
          };
        
    }, [selfID])

    useEffect(() => {
        Firestore.storage_retrieveOtherProfilePic(organiserID, setDisplayPicture, () => setDisplayPicture({uri: ""}));
        return () => {
            console.log("Organiser ID Unmounted") // This worked for me
          };
    }, [organiserID])


    useEffect(() => {
        const back = navigation.addListener('beforeRemove', (e) => {
            if (allowBackState===0) {
                e.preventDefault();
                setAllowBackState(1);
            }
        });
        return back;
        // return ()=>{
        //     back;
        //     console.log("back unmounted");
        // }
    } )





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

    // useEffect(() => {
    //     //setOverallTimeString(moment.utc(overallTime.as('milliseconds')).format('HH:mm:ss'));
    //     //console.log("TIME SET"+ moment.utc(overallTime.as('milliseconds')).format('HH:mm:ss'))
    // }, [overallTime])

    useEffect(() => {
        setDistance( distanceKM*1000+distanceM)
        return () => {
            console.log("Distance ID Unmounted") // This worked for me
          };
    }, [distanceKM,distanceM])
    useEffect(() => {
        console.log("Distance SET"+ distance)
        return () => {
            console.log("Distance2 ID Unmounted") // This worked for me
          };
    }, [distance])



    const sentInvite=()=>{
        setChooseState(false)

        // Firestore.db_requestFriendtoGame( selfID ,raceParam, distance, overallTimeString)
        // for (var i=0;i<addedFriendList.length;i++) {
        //     Firestore.db_requestFriendtoGame( addedFriendList[i].uid ,raceParam, distance, overallTimeString)
        // }
        // () => {
        //     Firestore.db_requestFriend(userData.uid);
        //     setStatus("pending");
        // }
    }

    const declineInvite=()=>{
        Firestore.db_declineRequestFriendtoGame( organiserID);
       
    }

    return (
        <SafeAreaView style={styles.screen}>
            <View style={{height:0.12*height, flexDirection:'row', justifyContent:'space-between',backgroundColor:'blue'}}>
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
                                <Text style={styles.idText} numberOfLines={1}>{organiserID.substring(0, 15)+"..."}</Text>
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
                                    onValueChange={(index) => {} }>
                                    {[...Array(24).keys()].map((value, i) => (
                                        <PickerItem label={value.toString()} value={i} key={i}/>
                                    ))}
                                </Picker>
                                <Text style={{color: '#BABBBF'}}>:</Text>
                                <Picker style={styles.scrollPickerComponent}
                                    lineColor="#FFFFFF"
                                    selectedValue={min}
                                    itemStyle={{color:"#FFFFFF", fontSize: 12}}
                                    onValueChange={(index) => {} }>
                                    {[...Array(60).keys()].map((value, i) => (
                                        <PickerItem label={value.toString()} value={i} key={i}/>
                                    ))}
                                </Picker>
                                <Text style={{color: '#BABBBF'}}>:</Text>
                                <Picker style={styles.scrollPickerComponent}
                                    lineColor="#FFFFFF"
                                    selectedValue={sec}
                                    itemStyle={{color:"#FFFFFF", fontSize: 12}}
                                    onValueChange={(index) => {}}>
                                    {[...Array(60).keys()].map((value, i) => (
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
                                onValueChange={(index) => {} }>
                                {[...Array(65).keys()].map((value, i) => (
                                    <PickerItem label={value.toString()} value={i} key={i}/>
                                ))}
                            </Picker>
                            <Text style={{color: '#BABBBF'}}>.</Text>
                            <Picker style={styles.scrollPickerComponent}
                                lineColor="#FFFFFF"
                                selectedValue={distanceM}
                                itemStyle={{color:"#FFFFFF", fontSize: 12}}
                                onValueChange={(index) => {} }>
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
            <Text style={{...styles.timeLabel,fontSize:14,paddingLeft: width * 0.02,height:height*0.04}}>Warning: Runsafely and obey traffic laws</Text>
            

            <View style={{width: width, height: height * 0.145,flexDirection:'column', alignItems:'center',justifyContent:'space-around',backgroundColor:'red'}}>
                <TouchableOpacity onPress={() => {
                        //navigation.navigate("RunScreenAlpha", {mode: "Space"})
                        setSelfStatus("accept");
                        Firestore.db_acceptRequestFriendtoGame( organiserID);
                        //navigation.navigate("LobbyOrganiserScreen2",{mode: "Time", chooseState:true})
                    }}>
                        <Text style={styles.startButtonColor}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                        setSelfStatus("decline")
                        setAllowBackState(5)
                        //setChooseState(true) 
                        //navigation.navigate("RunScreenAlpha", {mode: "Space"})
                    }}>
                        <Text style={{...styles.startButtonColor,backgroundColor:'transparent',borderWidth:3,borderColor:'#7289D9'}}>Decline</Text>
                </TouchableOpacity>
            </View>
            <View style={{width: width*0.92, height: height * 0.560,borderWidth:5,borderColor:"purple", flexDirection:'row', alignSelf:'center', overflow:'hidden'}}>
                    <FlatList
                        style={styles.list2}
                        numColumns={4}

                        data={friendList}
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
        textAlignVertical:'center',
        fontWeight: 'bold',
        fontSize: 18,
        color:'white',
        borderRadius:height * 0.8,
        //paddingTop:height * 0.1*0.1,
        //alignSelf:'center'
        backgroundColor: '#7289D9',
    } ,
});

export default LobbyParticipantScreen;
