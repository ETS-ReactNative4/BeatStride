import React, {useContext, useState, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, Image, Dimensions, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { Button, TextInput, IconButton } from 'react-native-paper';
import { useNavigation, CommonActions} from '@react-navigation/native';

import * as Authentication from "../../../api/auth";

const {width, height} = Dimensions.get('window');
const image = require('../../../assets/icons/Alphas.png');

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
);

function WelcomeScreen(props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const passwordTextInput = useRef();
  const navigation = useNavigation();

  const handleLogin = () => {
    Keyboard.dismiss();
    setIsLoginLoading(true);

    Authentication.signIn(
      { email, password },
      (user) => {
        navigation.dispatch(CommonActions.reset({ 
            index: 0, 
            routes: [{ name: "AppTab" }] 
        }))
      },
      (error) => {
        setIsLoginLoading(false);
        if (error.code === 'auth/invalid-email') {
            // setMessage('Invalid Email')
            Alert.alert(
              "Invalid Email",
              "Please ensure that the email you've entered is valid.",
              [ { text:"Understood", onPress: () => {} } ]
            )
        };
        if (error.code === 'auth/user-not-found') {
            // setMessage('Incorrect Email. There is no account linked to the email')
            Alert.alert(
              "User Not Found",
              "Please ensure that you have an account associated with the email.",
              [ { text:"Understood", onPress: () => {} } ]
            )
        };
        if (error.code === 'auth/wrong-password'){
            // setMessage('Incorrect Password. The password you entered is incorrect')
            Alert.alert(
              "Incorrect Password",
              "The password you entered is incorrect.",
              [ { text:"Understood", onPress: () => {} } ]
            )
        };
        return console.error(error);
      }
    );
  }

  return (
    <DismissKeyboard>
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.screenScroll} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
        <View style={styles.brand}>
          <IconButton icon="run" style={{ margin: 0 }} color={'#BABBBF'} />
            <Text style={{ fontSize: 16, color: '#BABBBF' }}>Alphas</Text>
        </View>

        <View style = {styles.container}>
          <Image style={styles.Logo} source={image}></Image>
          <Text style={styles.header}>Alphas</Text>
        </View>

        <TextInput
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
          left={<TextInput.Icon name="form-textbox-password" color={password ? '#7289DA' : '#BABBBF'} />}
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
          right={<TextInput.Icon name={isPasswordVisible ? "eye-off" : "eye"} color="#7289DA" onPress={() => setIsPasswordVisible((state) => !state)} />}
          theme={{colors: {primary: "#7289DA", placeholder : '#72767D', text: '#FFFFFF', underlineColor: 'transparent', background: '#4F535C'},}}
        />
        
        <Button
          mode = "contained"
          style={{ marginTop: 25, borderRadius: 10 }}
          contentStyle={{ paddingVertical: 5 }}
          onPress={handleLogin}
          loading={isLoginLoading}
          disabled={isLoginLoading}
          theme={{ dark: true, colors: { primary: '#7289DA', underlineColor:'transparent',} }}
        >Log In
        </Button>

        <Button
          mode="outlined"
          onPress = {() => navigation.navigate("RegisterScreen")} //onpress screen name
          style={{ marginTop: 10, borderRadius: 10, backgroundColor: '#424549', borderWidth:2, borderColor: '#7289DA' }}
          contentStyle={{ paddingVertical: 5 }}
          theme={{ dark: true, colors: { primary: '#7289DA', underlineColor:'transparent',} }}
        >Create Account
        </Button>

        <Pressable onPress={() => navigation.navigate("ForgotPasswordScreen")} style={{alignSelf: 'center'}}>
          <Text style = {styles.forgetPassword}>Forgot Password</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
    </DismissKeyboard>
  )
}

export default function App() {
  return <WelcomeScreen/>;
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
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -5,
    marginTop: 20,
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 200,
  },
  Logo: {
    width: 200,
    height: 200,
    position: 'absolute',
    top: 20,
    resizeMode: "contain",
    alignItems: "center",
  },
  header: {
    fontStyle: 'italic',
    fontSize: 30,
    fontWeight: 'bold',
    color: "#BABBBF",
  },
  subtitle: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 10,
    color: '#FFFFFF'
  },
  forgetPassword: {
    paddingTop: 20,
    fontStyle: 'normal',
    fontSize: 15,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: "#BABBBF",
  }
});