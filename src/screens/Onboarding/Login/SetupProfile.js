import React, {useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, ScrollView, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import { Button, TextInput, Avatar } from 'react-native-paper';
import { useNavigation, CommonActions } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker'
import * as ImagePicker from 'expo-image-picker';
import * as Firestore from '../../../api/firestore';
import moment from 'moment';

const {width, height} = Dimensions.get('window');

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
);

function SetupProfile(props) {
    const [description, setDescription] = React.useState('');
    const [weight, setWeight] = React.useState('');
    const [height, setHeight] = React.useState('');
    const [displayPicture, setDisplayPicture] = useState({uri: ""});
    const [birthdate, setDate] = useState(new Date());
    const navigation = useNavigation();
    const currentDate = new Date();
    const minDate = new Date("1950-01-01");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setDate(birthdate); //birthdate
        console.log("useeffect" + birthdate);
    }, [birthdate])

    const uploadProfilePic = async () => {

        let results = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [2, 2],
          quality: 1,
        })

        if (!results.cancelled) {
            console.log('Image location/uri: ');
            console.log(results.uri);
            //location = 'Image location/uri: ' + results.uri;
            setDisplayPicture({uri: results.uri});
        }
    };

    const handleRegister = () => {
        Keyboard.dismiss();
        if (displayPicture.uri != "") {
            Firestore.storage_uploadProfilePic(displayPicture.uri);
        }
        const data = {
            description:description,
            weight:weight,
            height:height,
            birthday:moment(birthdate).format('MMMM Do YYYY'),
        }
        console.log(data.birthday);
        Firestore.db_updateSetup(data,
            () => {
                navigation.dispatch(CommonActions.reset({ 
                    index: 0, 
                    routes: [{ name: "FollowScreen" }]
                }))
            },
            () => {
                console.log('registration failed')
            },
        )
    };

    return (
        <DismissKeyboard>
            <SafeAreaView style={styles.screen}>
                <ScrollView contentContainerStyle={styles.screenScroll} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
                <Text style={styles.header}>Personal Virtual Trainer!</Text>
                <Text style={styles.header2}>Setup your profile 2/2</Text>
                <Text style={styles.subheader}>Profile Picture (Optional)</Text>

                <View style={styles.container}>
                    <View style={styles.button_container}>
                        {(displayPicture.uri == "") ? 
                            <Avatar.Image
                            size = {120}
                            source = {require("../../../assets/icons/avatar.jpg")}
                            />
                        :
                            <Avatar.Image
                            size = {120}
                            source = {displayPicture}
                            />
                        }

                        <Button
                        mode = 'contained'
                        onPress = {uploadProfilePic}
                        style={{marginTop:10 , marginLeft: 15, borderRadius: 10}}
                        contentStyle={{ paddingVertical: 5 }}
                        theme={{ dark: true, colors: { primary: '#7289DA', underlineColor:'transparent',} }}
                        >Upload
                        </Button>
                    </View>

                    <View style = {styles.upload_container}>
                    <TextInput
                     mode = "flat"
                     placeholder = "Set Height (cm)"
                     keyboardType = "number-pad"
                     maxLength = {3}
                     value = {height}
                     onChangeText = {height => setHeight(height)}
                     outlineColor = "#BABBBF"
                     onSubmitEditing={() => Keyboard.dismiss()}
                     theme={{colors: {primary: "#7289DA", placeholder : '#72767D', text: '#FFFFFF', underlineColor: 'transparent', background: '#4F535C'},}}
                     style={{borderRadius: 5, marginTop: 10}}
                    />

                    <TextInput
                     mode = "flat"
                     placeholder = "Set Weight (kg)"
                     keyboardType = "number-pad"
                     maxLength = {3}
                     value = {weight}
                     onChangeText = {weight => setWeight(weight)}
                     outlineColor = "#BABBBF"
                     onSubmitEditing={() => Keyboard.dismiss()}
                     theme={{colors: {primary: "#7289DA", placeholder : '#72767D', text: '#FFFFFF', underlineColor: 'transparent', background: '#4F535C'},}}
                     style={{borderRadius: 5, marginTop: 10}}
                    />
                    </View>
                </View>
                
                <Button 
                    mode = "contained" 
                    onPress = {() => setOpen(true)}
                    style={{marginTop:20, marginBottom:0, borderRadius: 10}}
                    contentStyle={{ paddingVertical: 5 }}
                    theme={{ dark: true, colors: { primary: '#7289DA', underlineColor:'transparent',} }}
                >Set Birthday
                <DatePicker
                    modal
                    open = {open}
                    date = {birthdate}
                    onConfirm = {(info) => {
                        setOpen(false);
                        setDate(info);
                    }}
                    onCancel = {() => {
                        setOpen(false)
                    }}
                    maximumDate = {currentDate}
                    minimumDate = {minDate}
                    mode = "date"
                />
                </Button>

                <TextInput
                mode = 'flat'
                label="Description (Optional)"
                placeholder = "Enter your Description"
                multiline = {true}
                numberOfLines = {4}
                maxLength = {80}
                value = {description}
                onChangeText = {description => setDescription(description)}
                onSubmitEditing={() => Keyboard.dismiss()}
                autoCapitalize="sentences"
                returnKeyType="done"
                left={<TextInput.Icon name="pencil" color={description ? '#7289DA' : '#BABBBF'} />}
                theme={{colors: {primary: "#7289DA", placeholder : '#72767D', text: '#FFFFFF', underlineColor: 'transparent', background: '#4F535C'},}}
                style={{borderRadius: 5, marginTop: 20}}
                />

                <Button
                mode = 'contained'
                disabled = {!Boolean(weight && height && birthdate)}
                icon = 'arrow-right-thick'
                onPress = {handleRegister}
                style={{marginTop:15, marginBottom:5, borderRadius: 10}}
                contentStyle={{ paddingVertical: 5 }}
                theme={{ dark: true, colors: { primary: '#7289DA', underlineColor:'transparent',} }}
                >Create Account
                </Button>

                </ScrollView>
            </SafeAreaView>
        </DismissKeyboard>
      )
}

export default function App() {
    return <SetupProfile/>;
}

const styles = StyleSheet.create({
    screen:{
      paddingTop: 0.01 * height,
      paddingBottom: 0.01 * height,
      paddingHorizontal: 0.05 * width,
      flex: 1,
      backgroundColor: '#282B30',
    },
    screenScroll:{
        paddingBottom: 20, 
        paddingHorizontal: 20,
    },
    header:{
        paddingTop: 30,
        fontStyle: 'italic',
        fontSize: 40,
        fontWeight: 'bold',
        color: "#BABBBF",
    },
    header2:{
        paddingTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 10,
        color: '#7289DA',
    },
    subheader:{
        paddingTop: 10,
        fontSize: 17,
        fontWeight: 'normal',
        paddingBottom: 10,
        color: 'white',
    },
    container: {
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 10,
    },
    button_container: {
        flexDirection: "column",
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 0,
    },
    upload_container: {
        flexDirection: "column",
        justifyContent: 'flex-start',
        paddingLeft: 40,
    },
});