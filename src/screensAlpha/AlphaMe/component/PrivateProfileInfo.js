import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet,  Text,  View, Dimensions, Animated, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'
import moment from 'moment';
import * as Firestore from '../../../api/firestore';
const {width, height} = Dimensions.get("window")

import { Button } from 'react-native-paper';
/**
 * This is a functional component representing private information only friends can see.
 * 
 * @author NTU CZ2006 Team Alpha
 */
const PrivateProfileInfo = (props) => {
    const userData = props.userData;
    const [birthday, setBirthday] = useState(",");
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);

    const [totalDistance, setTotalDistance] = useState(0);
    const [runCount, setRunCount] = useState(0);
    const [longestDistance, setLongestDistance] = useState(0);
    const [fastestPace, setFastestPace] = useState(0);
    const [strideDistance, setStrideDistance] = useState(0);
    const [joinDate, setJoinDate] = useState(",");
    const [age, setAge] = useState(0); 
    
    //for history rendering
    const [history, setHistory] = useState([]);
    const [filterHistory, setFilterHistory] = useState([]);
    
    const[filterBy,setFilterBy] = useState('all');

    //use effect call when first rendered
    useEffect(async() => {
        Firestore.db_historyView(
            (historyList) => {setHistory(historyList.reverse())},
            (error) => {console.log('history view fail')}
        )
    },[])
    
    useEffect(() => {
        setFilterHistory(history);
    },[history])

    /**
     * This is a render effect based on "userData" state.
     */
    useEffect(() => {
        setBirthday(userData.birthday);
        setHeight(userData.height);
        setWeight(userData.weight);

        // setTotalDistance(userData.totalDistance);
        // setRunCount(userData.runCount);
        // setLongestDistance(userData.longestDistance);
        // setFastestPace(userData.fastestPace);
        // setStrideDistance(userData.strideDistance);
        setAge(calculate_age(birthday));
    }, [userData])

    filterHistFunc = (history,filterNo) => {
        currentDay = new Date().getDate();
        currentMonth = new Date().getMonth()+1;
        currentYear = new Date().getFullYear();
        
        if(filterNo ==1)
        {
            setFilterHistory(history.filter((item)=> { 
                var[month,day,year] = item.date.split("/");
                // console.log("Filter by day"+ "day"+currentDay+":"+day +"Month"+currentMonth+":"+month +"Year"+ currentYear+":"+year);
                return  currentDay === +day && currentMonth === +month && currentYear === +year}))   
        }
        else if(filterNo == 2){
            setFilterHistory(history.filter((item)=> { 
                var[month,day,year] = item.date.split("/");
                return  currentMonth === +month && currentYear === +year}))
        }
        else if (filterNo ==3)
        {
            setFilterHistory(history.filter((item)=> { 
                var[month,day,year] = item.date.split("/");
                return currentYear === +year})
                )
        }
        else
        {
            return history;
        }
    }
    calculate_age = (birthday) => {
        var dateee = moment(birthday,"MMMM Do YYYY, h:mm a").toDate();
        var today = new Date();
        var birthDate = new Date(dateee); 
        var age_now = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
        {
            age_now--;
        }
        return age_now;
      }

      useEffect(() => {
              var max = 0;
              var maxduration = 0;
              var total = 0;
              var totalsteps = 0;
            for(var i = 0; i <filterHistory.length;i++)
            {   
                if(max < filterHistory[i].distance)
                {
                    max = filterHistory[i].distance;
                    console.log("max:"+filterHistory[i].distance);

                }
                if(maxduration < filterHistory[i].duration)
                {
                    maxduration = filterHistory[i].duration;
                }
                totalsteps += filterHistory[i].steps;
                total += filterHistory[i].distance;
            }
            setTotalDistance(total);
            setLongestDistance(max);
            setFastestPace(totalsteps);
            setStrideDistance(maxduration);
    }, [filterHistory])

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    return (
        <View>
        <Text style = {{fontSize:30,color: "#FFFF" , paddingTop :10}}> Activity Stats</Text>
        {/*Button placement filter*/}
        <View style = {{flexDirection :'row'}}>
        <Button
                    mode="contained"
                    style={{flex: 1,borderWidth: 5, borderRadius: 10}}
                    contentStyle={{paddingVertical: 5}}
                    color = {(filterBy == 'day')? '#7289DA':"#4F535C"}
                    theme={{ dark: true, colors: {primary:'#7289DA', underlineColor: 'transparent'}, }}
                    onPress={() => {console.log('filter by day');
                    filterHistFunc(history,1)
                    setFilterBy('day')
                    }}
                    >
                    <Text style={{color: '#FFFFFF'}}>Day</Text>
        </Button>

        <Button
                    mode="contained"
                    style={{flex:1, borderWidth: 5,borderRadius: 10}}
                    contentStyle={{paddingVertical: 5}}
                    color = {(filterBy == 'month')? '#7289DA':"#4F535C"}
                    theme={{ dark: true, colors: {primary: '#7289DA', underlineColor: 'transparent'}, }}
                    onPress={() => {console.log('filter by month');
                    filterHistFunc(history,2)
                    setFilterBy('month')
                    }}
                    >
                    <Text style={{color: '#FFFFFF'}}>Month</Text>
        </Button>

        <Button
                    mode="contained"
                    style={{flex:1, borderWidth: 5,borderRadius: 10}}
                    contentStyle={{paddingVertical: 5}}
                    color = {(filterBy == 'year')? '#7289DA':"#4F535C"}
                    theme={{ dark: true, colors: {primary: "#4F535C", underlineColor: 'transparent'}, }}
                    onPress={() => {filterHistFunc(history,3)
                    setFilterBy('year')
                    }}
                    >
                    <Text style={{color: '#FFFFFF'}}>Year</Text>
        </Button>
        </View>

        {/* activity stats table*/}
        <View style={styles.componentContainer}>
            <View style={styles.userRunDataContainer}>
                <View style={styles.userRunDataCard}>
                    <View style={{ flexDirection:"row" }}>
                        <Icon name="line-style" size={width*0.1} color="#7289DA" />
                        <View>
                            <Text style={styles.dataText} numberOfLines={1}>{((totalDistance)/1000).toFixed(2)}</Text>
                            <Text style={styles.dataLabel}>Total Distance (km)</Text>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection:"row" }}>
                    <View style={styles.userRunDataCard}>
                        <View style={{ flexDirection:"row" }}>
                            <Icon name="run-circle" size={width*0.10} color="#7289DA" />
                            <View>
                                <Text style={styles.dataText} numberOfLines={1}>{filterHistory.length}</Text>
                                <Text style={styles.dataLabel}>Total Runs</Text>
                            </View>
                        </View>
                    </View >
                </View>
            </View>
            <View style={styles.userRunDataContainer}>
                <View style={{ flexDirection:"row" }}>  
                    <View style={styles.userRunDataCard} >
                        <View style={{ flexDirection:"row" }}>
                            {/* icon slot */}
                            <Icon name="leaderboard" size={width*0.1} color="#7289DA" />
                            <View>
                                <Text style={styles.dataText} numberOfLines={1}>{(fastestPace).toFixed(1)}</Text>
                                <Text style={styles.dataLabel}>Total steps</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.userRunDataCard} >
                    <View style={{ flexDirection:"row" }}>
                        <Icon name="thumb-up" size={width*0.1} color="#7289DA" />
                        <View>
                            <Text style={styles.dataText} numberOfLines={1}>{(longestDistance/1000).toFixed(2)}</Text>
                            <Text style={styles.dataLabel}>Longest Distance(km)</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.userRunDataContainer}>
                <View style={styles.userRunDataCard} >
                    <View style={{ flexDirection:"row" }}>
                        <Icon name="timeline" size={width*0.1} color="#7289DA" />
                        <View>
                            <Text style={styles.dataText} numberOfLines={1}>{((strideDistance/60000)).toFixed(0)}</Text>
                            <Text style={styles.dataLabel}>longest duration(min)</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
        {/* Health stats Table*/}
        <View>
        <Text style = {{fontSize:30,color: "#FFFF", paddingTop: 15}}> Health Stats</Text>
            <View style={styles.componentContainer}>
                <View style={styles.userRunDataContainer}>
                    <View style={{ flexDirection:"row" }}>  
                        <View style={styles.userRunDataCard} >
                            <View style={{ flexDirection:"row" }}>
                                {/*Insert Icon here*/}
                                <View>
                                    <Text style={styles.dataText} numberOfLines={1}>{(weight)}</Text>
                                    <Text style={styles.dataLabel}>Weight (kg)</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.userRunDataCard} >
                        <View style={{ flexDirection:"row" }}>
                            {/*Insert Icon here*/}
                            <View>
                                <Text style={styles.dataText} numberOfLines={1}>{(height)}</Text>
                                <Text style={styles.dataLabel}>Height (m)</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.userRunDataContainer}>
                    <View style={{ flexDirection:"row" }}>  
                        <View style={styles.userRunDataCard} >
                            <View style={{ flexDirection:"row" }}>
                                {/*Insert Icon here*/}
                                <View>
                                    <Text style={styles.dataText} numberOfLines={1}>{((weight)*(1/10)*(totalDistance)).toFixed(1)}</Text>
                                    <Text style={styles.dataLabel}>Total Calorie(kcal)</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.userRunDataCard} >
                        <View style={{ flexDirection:"row" }}>
                            {/*Insert Icon here*/}
                            
                            <View> 
                                <Text style={styles.dataText} numberOfLines={1}>{calculate_age(birthday)}</Text>
                                <Text style={styles.dataLabel}>Age</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
        
        </View>
       
    );
};

const styles = StyleSheet.create({
    componentContainer:{
        width: width,
        alignItems: 'center',
    },
    userRunDataContainer:{
        width: width * 0.95,
        height: height * 0.15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: height * 0.01,
    },
    userRunDataCard:{
        width: width * 0.925 /2,
        height: height * 0.15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4F535C',
    },
    dataText:{
        fontWeight: 'bold',
        fontSize: 24,
        paddingHorizontal: width * 0.01,
        color: '#FFFFFF',
        alignItems: 'center'
    },
    dataLabel:{
        fontSize: 12,
        color: '#BABBBF',
        alignItems: 'center'
    },
    pageList:{
        width: width * 0.95,
        height: height * 0.2,
        // backgroundColor: 'green',
    }
});

export default PrivateProfileInfo;