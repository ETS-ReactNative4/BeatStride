import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';

import * as Firestore from '../../../api/firestore';
import DistanceItem from './DistanceItem';
import { IconButton } from "react-native-paper";
import HistoryItem from './HistoryItem';
import HistoryViewMap from './Alpha_HistoryViewMap';


const { width, height } = Dimensions.get("window")



export default function DistancePage({ type }) {

    const [friendList, setFriendList] = useState([]);
    const [displayPicture, setDisplayPicture] = useState({ uri: "" });
    const [history, setHistory] = useState([])
    const [empty, setEmpty] = useState(true);
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalRuns, setTotalRuns] = useState(0);
    const [friendData, setFriendData] = useState([]);
    const [uid, setuid] = useState("");
    const [pressuid, setPressuid] = useState("");
    console.log("Type in distancePage " + type)
    console.log(uid)

    useEffect(() => {
        Firestore.db_friendsList(
            (userList) => {
                setFriendList(userList)
                console.log(userList)
            },
            (error) => { console.log(error) },
        )

        Firestore.storage_retrieveProfilePic(setDisplayPicture, () => setDisplayPicture({ uri: "" }));


        Firestore.db_getUserDataSnapshot(
            (userData) => {
                setTotalDistance(userData.totalDistance)
                setTotalRuns(userData.runCount)
                setuid(userData.uid)
            },
            (error) => { console.log(error) },
        )



    }, [])

    useEffect(() => {
        if (uid != "") {
            Firestore.db_userhistoryView(uid,
                (historyList) => { setHistory(historyList.reverse()) },
                (error) => { console.log('history view fail') }
            )
        }
    }, [uid])

    useEffect(() => {
        var uidList = [];

        for (var i = 0; i < friendList.length; i++) {
            uidList[i] = friendList[i].uid;
        }

        console.log("uidList = " + uidList);
        console.log(friendList)

        Firestore.db_queryFriendsData(uidList,
            (userList) => {
                setFriendData(userList)
                console.log(userList)
            },
            (error) => { console.log(error) })
    }, [friendList])

    useEffect(() => {
        console.log("What type in useEffect "+ type);
        console.log("Friend Data length " + friendData.length);
        if (friendData.length != 0) {
            if (type == 1) {
                console.log("friendData = " + friendData.sort((a, b) => (a.longestDistance < b.longestDistance) ? 1 : -1));
                for (var i = 0; i < friendData.length; i++) {
                    console.log("friend_displayName = " + friendData[i].displayName);
                    console.log("friend_longestDistance = " + friendData[i].longestDistance);
                }
            } else if (type == 2) {
                console.log("friendData = " + friendData.sort((a, b) => (a.fastestPace > b.fastestPace) ? 1 : -1));
                for (var i = 0; i < friendData.length; i++) {
                    console.log("friend_displayName = " + friendData[i].displayName);
                    console.log("friend_fastestPace = " + friendData[i].fastestPace);
                }
            } else {
                console.log("Nothing to display");
            }
        }
            console.log(friendData);

        }, [friendData, type])

    useEffect(() => {
        if (pressuid != "") {
            Firestore.db_userhistoryView(pressuid,
                (historyList) => { setHistory(historyList.reverse()) },
                (error) => { console.log('history view fail') }
            )
        }
    }, [pressuid, type])

    filterHistory = (history, filterType) => {
        console.log('Filter history by ' + filterType);
        //sort history here
    }

    return (
        <View style={styles.container}>
            <View style={styles.friendlist}>
                <View style={styles.myProfile}>
                    <TouchableOpacity style={styles.profilePicContainer} onPress={() => { setPressuid(uid) }}>
                        {(displayPicture.uri != "") &&
                            <Image style={styles.profilePicContainer} source={displayPicture} />
                        }
                    </TouchableOpacity>
                </View>
                <View style={{ width: width - height * 0.1, height: height * 0.145, flexDirection: 'row' }}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.list2}
                        data={friendData}
                        extraData={friendData}
                        keyExtractor={item => item.uid}
                        renderItem={({ item }) => <DistanceItem item={item}
                            pressuid={pressuid}
                            setPressuid={(uid) => { setPressuid(uid) }}
                        />}
                        ListEmptyComponent={
                            <View style={styles.emptyList}>
                            </View>
                        }
                    />
                </View>
            </View>
            <View style={styles.content}>
                <FlatList
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={styles.listContent}
                    numColumns={1}
                    data={history}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) =>
                        <View>
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
                            <HistoryViewMap
                                positions={item.positions}
                            />
                        </View>
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyList}>
                            <IconButton icon="run" style={{ margin: 0 }} color={'#72767D'} size={height * 0.045} />
                            <Text style={styles.emptyText}>No Run History</Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
    },
    friendlist: {
        height: height * 0.12,
        width: width,
        flexDirection: "row",
    },
    profilePicContainer: {
        height: height * 0.1,
        aspectRatio: 1,
        borderRadius: width,
        backgroundColor: '#4F535C',
        alignItems: 'center',
    },
    myProfile: {
        width: width * 0.2,
        backgroundColor: '#282B30',
    },
    content: {
        backgroundColor: "#282B30",
        height: height * 0.58,
        width: width,
    },
    list2: {
        width: width * 0.75,
        height: height * 0.145,
        //backgroundColor: 'red',
        backgroundColor: '#282B30'
    },
    emptyList: {
        width: width,
        height: height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
    },
    emptyText: {
        fontSize: 14,
        color: '#72767D'
    },
    listContent: {
        alignItems: 'center',
        paddingVertical: height * 0.01,
    },
})