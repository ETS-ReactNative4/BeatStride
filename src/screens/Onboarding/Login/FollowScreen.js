import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image} from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Swiper from 'react-native-swiper'

const {width, height} = Dimensions.get('window');
const park = require('../../../assets/icons/Display.jpg');
const parkmap = require('../../../assets/icons/ParkMap.png');
const calendar = require('../../../assets/icons/Calendar.png');
const trophy = require('../../../assets/icons/Trophy.png');

function Onboarding(props){
    const navigation = useNavigation();
        return (
          <Swiper style={styles.wrapper} showsButtons={false} loop = {false}>
              <View style={styles.screen}>
                  <View style = {styles.container}>
                      <Image style = {styles.image_one} source={park}></Image>
                  </View>
                  <View style = {styles.header_container}>
                      <Text style={styles.header_text}>Time Racing</Text>
                  </View>
                  <View style = {styles.text_container}>
                      <Text style={styles.text}>Race with your friend remotely</Text>
                      <Text style={styles.text}>"Even apart, we are connected!"</Text>
                  </View>
              </View>
              
              <View style={styles.screen}>
                  <View style = {styles.container}>
                      <Image style = {styles.image_one} source={parkmap}></Image>
                  </View>
                  <View style = {styles.header_container_two}>
                      <Text style={styles.header_text}>Space Racing</Text>
                  </View>
                  <View style = {styles.text_container}>
                      <Text style={styles.text}>Conquer your local park and become</Text>
                      <Text style={styles.text}>"King of the Park"</Text>
                  </View>
              </View>
  
              <View style={styles.screen}>
                  <View style = {styles.container}>
                      <Image style = {styles.image_one} source={calendar}></Image>
                  </View>
                  <View style = {styles.header_container_two}>
                      <Text style={styles.header_text}>Visualize Health</Text>
                  </View>
                  <View style = {styles.text_container}>
                      <Text style={styles.text}>Calories, Foot Steps, BMI</Text>
                      <Text style={styles.text}>and Exercise Stats</Text>
                  </View>
              </View>
  
              <View style={styles.screen}>
                  <View style = {styles.container}>
                      <Image style = {styles.image_one} source={trophy}></Image>
                  </View>
                  <View style = {styles.header_container_two}>
                      <Text style={styles.header_text}>Visualize Health</Text>
                  </View>
                  <View style = {styles.text_container}>
                      <Text style={styles.text}>Calories, Foot Steps, BMI</Text>
                      <Text style={styles.text}>and Exercise Stats</Text>
                  </View>

                  <Button
                       mode = 'contained'
                       onPress = {() => navigation.dispatch(CommonActions.reset({
                           index: 0,
                           routes: [{ name: "AppTab" }]
                       }))}
                       style={{marginTop:15, marginBottom:5, borderRadius: 10, width: 120, marginLeft: (width/2)-60}}
                       contentStyle={{ paddingVertical: 5 }}
                       theme={{ dark: true, colors: { primary: '#7289DA', underlineColor:'transparent',} }}
                  >Let's Go!
                  </Button>
                  
              </View>
  
          </Swiper>
        )
}

export default function App() {
    return <Onboarding/>;
}

const styles = StyleSheet.create({
    wrapper: {},
    screen:{
        flex: 1,
        backgroundColor: '#282B30',
    },
    container: {
        flexDirection: "row",
        flexWrap: 'wrap',
    },
    header_container: {
        paddingTop: height/2.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header_container_two: {
        paddingTop: height/2.05,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_container: {
        paddingTop: 10,
        textAlign: 'center',
    },
    image_one: {
        flex: 1,
        width: width,
        height: height/1.5,
        justifyContent: 'flex-start',
        position: 'absolute',
        resizeMode: "contain",
        alignItems: "center",
    },
    header_text: {
      color: '#7289DA',
      fontSize: 25,
      fontWeight: 'bold'
    },
    text: {
      color: '#BABBBF',
      fontSize: 18,
      fontWeight: 'normal',
      textAlign: 'center'
    },
})