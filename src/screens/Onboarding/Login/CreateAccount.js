import React, {useState, useRef } from 'react';
import { View, StyleSheet, Text, SafeAreaView, Dimensions, ScrollView, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import { Button, TextInput, Checkbox} from 'react-native-paper';
import { useNavigation, CommonActions } from '@react-navigation/native';
import moment from 'moment';

import * as Authentication from '../../../api/auth';
import * as Firestore from '../../../api/firestore';

const {width, height} = Dimensions.get('window');

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
);

function CreateAcc() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const emailTextInput = useRef();
  const passwordTextInput = useRef();
  const confirmPasswordTextInput = useRef();
  const navigation = useNavigation();

  const checkValidataion = () => {
    Keyboard.dismiss();
        setIsRegisterLoading(true);

        if (password != confirmPassword) {
          setIsRegisterLoading(false);
          Alert.alert(
              "Passwords Do Not Match",
              "Please ensure that the passwords you've entered matches.",
              [ { text:"Understood", onPress: () => {confirmPasswordTextInput.current.focus()} } ]
          )
        } else{
          Authentication.createAccount(
              { name: username, email, password },
              (user) => {

                  const Credentials = {
                      displayName: user.displayName,
                      email: user.email,
                      uid: user.uid,
                      totalDistance: 0,
                      runCount: 0,
                      goalDistance: 0,
                      goalTime: 0,
                      strideDistance: 0,
                      longestDistance: 0,
                      fastestPace: 0,
                      joinDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
                      description: null,
                      birthday: null,
                      weight: 0,
                      height: 0,
                  }

                  Firestore.db_createAccount(Credentials, 
                      () => {
                          navigation.dispatch(CommonActions.reset({ 
                              index: 0, 
                              routes: [{ name: "SetupProfile" }]
                          }))
                      },
                      () => {
                          console.log('registration failed')
                          setIsRegisterLoading(false);
                      },
                  )

          },
          (error) => {
              setIsRegisterLoading(false);

              if (error.code === 'auth/email-already-in-use') {
                  Alert.alert(
                  "Email Already In-use",
                  "The email you've entered is already in-use. Please use another email.",
                  [ { text:"Understood", onPress: () => {emailTextInput.current.focus()} } ]
                  )
              };
              if (error.code === 'auth/invalid-email') {
                  Alert.alert(
                  "Invalid Email",
                  "Please ensure that the email you've entered is valid.",
                  [ { text:"Understood", onPress: () => {emailTextInput.current.focus()} } ]
                  )
              };
              if (error.code === 'auth/operation-not-allowed') {
                  Alert.alert(
                  "System Unavailable",
                  "Creation of account is disabled at the moment. Please try again after a moment",
                  [ { text:"Understood", onPress: () => {} } ]
                  )
              };
              if (error.code === 'auth/weak-password') {
                  Alert.alert(
                  "Weak Password",
                  "Please ensure that the password you've entered meets the minimum requirements",
                  [ { text:"Understood", onPress: () => {passwordTextInput.current.focus()} } ]
                  )
              }; 
              return console.error(error);
          }
          );
      }
  };

  return (
    <DismissKeyboard>
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.screenScroll} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Race Across Time & Space!</Text>
        <Text style={styles.header2}>Create Your Account 1/2</Text>

        <TextInput
          mode = "outlined"
          label="Username"
          style={{ marginTop: 10 }}
          placeholder="Enter your username"
          value = {username}
          onChangeText = {username => setUsername(username)}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmit={Keyboard.dismiss}
          onSubmitEditing={() => passwordTextInput.current.focus()}
          left={<TextInput.Icon name="account" color={email ? '#7289DA' : '#BABBBF'} />}
          theme={{colors: {primary: "#7289DA", placeholder : '#72767D', text: '#FFFFFF', underlineColor: 'transparent', background: '#4F535C'},}}
        />

        <TextInput
          ref = {emailTextInput}
          mode = "outlined"
          label="Email Address"
          keyboardType="email-address"
          style={{ marginTop: 10 }}
          placeholder="Enter your email"
          value = {email}
          onChangeText = {email => setEmail(email)}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmit={Keyboard.dismiss}
          onSubmitEditing={() => passwordTextInput.current.focus()}
          left={<TextInput.Icon name="at" color={email ? '#7289DA' : '#BABBBF'} />}
          theme={{colors: {primary: "#7289DA", placeholder : '#72767D', text: '#FFFFFF', underlineColor: 'transparent', background: '#4F535C'},}}
        />

        <TextInput
          ref = {passwordTextInput}
          mode = "outlined"
          label = "Password"
          style={{ marginTop: 10 }}
          placeholder="Enter your password"
          value={password}
          onChangeText={password => setPassword(password)}
          onSubmitEditing={() => confirmPasswordTextInput.current.focus()}
          left={<TextInput.Icon name="form-textbox-password" color={password ? '#7289DA' : '#BABBBF'} />}
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
          right={<TextInput.Icon name={isPasswordVisible ? "eye-off" : "eye"} color="#7289DA" onPress={() => setIsPasswordVisible((state) => !state)} />}
          theme={{colors: {primary: "#7289DA", placeholder : '#72767D', text: '#FFFFFF', underlineColor: 'transparent', background: '#4F535C'},}}
        />

        <TextInput
          ref = {confirmPasswordTextInput}
          mode = "outlined"
          label = "Re-Enter Password"
          style={{ marginTop: 10 }}
          placeholder="Re-Enter your password"
          onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
          left={<TextInput.Icon name="form-textbox-password" color={password ? '#7289DA' : '#BABBBF'} />}
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
          right={<TextInput.Icon name={isPasswordVisible ? "eye-off" : "eye"} color="#7289DA" onPress={() => setIsPasswordVisible((state) => !state)} />}
          theme={{colors: {primary: "#7289DA", placeholder : '#72767D', text: '#FFFFFF', underlineColor: 'transparent', background: '#4F535C'},}}
        />

        <View style={styles.terms}>
          <Checkbox.Item
          label = "By proceeding and tapping on Create Account, you agree to Alphas's Terms of Service."
          position = "leading"
          status = {checked ? 'checked' : 'unchecked'}
          onPress = {() => {setChecked(!checked);}}
          labelStyle = {{fontSize:12,textAlign:'left'}}
          theme={{colors: {text: '#BABBBF'},}}
          />
        </View>
        
        <Button
          loading={isRegisterLoading}
          disabled = {!Boolean(checked && password && confirmPassword && email)}
          mode = "contained"
          style={{ marginTop: 10, borderRadius: 10 }}
          contentStyle={{ paddingVertical: 5 }}
          onPress={checkValidataion} //register(email, password) navigation.navigate("SetupProfile")
          theme={{ dark: true, colors: { primary: '#7289DA', underlineColor:'transparent',} }}
        >Create Account
        </Button>

        <Button
          mode="outlined"
          onPress = {() => navigation.goBack()}
          style={{ marginTop: 10, borderRadius: 10, backgroundColor: '#424549', borderWidth:2, borderColor: '#7289DA' }}
          icon = {"arrow-left-thick"}
          contentStyle={{ paddingVertical: 5 }}
          theme={{ dark: true, colors: { primary: '#7289DA', underlineColor:'transparent',} }}
        >Back
        </Button>

      </ScrollView>
    </SafeAreaView>
    </DismissKeyboard>
  )
}

export default function App() {
  return <CreateAcc/>;
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
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  header: {
    fontStyle: 'italic',
    fontSize: 40,
    fontWeight: 'bold',
    paddingTop: 30,
    color: "#BABBBF",
  },
  header2: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
    color: '#7289DA',
  },
  terms: {
    flexDirection: "row",
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingTop: 5,
  },
  termsandcondition:{
    fontSize: 10,
    fontWeight: 'normal',
    color: '#BABBBF',
    flexShrink: 1,
  },
});