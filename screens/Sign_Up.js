import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Image, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState, useRef, useEffect } from 'react';
import Modal from "react-native-modal";
import axios from 'axios'
import { useFonts } from 'expo-font'
import LoadingAnimation from './LoadingAnimation';

export default function Sign_Up({ navigation }) {
  const [fontsLoaded]=useFonts({
    'bebas': require('../assets/fonts/BebasNeue-Regular.ttf')
  })
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRep, setPasswordRep] = useState('')
  const [DOB, setDOB] = useState('')
  const [phoneNum, setPhoneNum] = useState('')
  const refName = useRef('')
  const refUsername = useRef('')
  const refPassword = useRef('')
  const refPasswordRep = useRef('')
  const refDOB = useRef('')
  const refPhoneNum = useRef('')
  const [reason, setReason] = useState('null')
  const [modal, setError] = useState(false)
  const [option, setOption] = useState('select your role...');
  const [isLoading, setIsLoading] = useState(false);

  function handleTextChange(text, inpRef) {
    if (inpRef === refName)
      setName(text)
    else if (inpRef === refUsername)
      setUsername(text)
    else if (inpRef === refPassword)
      setPassword(text)
    else if (inpRef === refPasswordRep)
      setPasswordRep(text)
    else if (inpRef === refDOB)
      setDOB(text)
    else if (inpRef === refPhoneNum)
      setPhoneNum(text)
  }
  function handleSignInButton() {
    checkDate(DOB)
    if (password != passwordRep || !password) {
      setError(true)
      setReason('passwords don\'t match')
    } else {
      let regex = /\s|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\`|\'|\;|\[|\]|\{|\}/
      if (regex.test(username) || regex.test(name)) {
        setError(true)
        setReason('username and name can\'t be special charecters')
      } else if (option === null) {
        setError(true)
        setReason('select a role')
      } else {
        sendCredentials()
      }
    }
  }

  function checkDate(date) {
    let regex = /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])$/g
    if (!regex.test(date)) {
      setError(true)
      setReason('enter an appropriate date')
      return false
    } else
      return true
  }

  function sendCredentials() {
    const formData = new FormData
    formData.append('name', name)
    formData.append('username', username)
    formData.append('password', password)
    formData.append('dateOfBirth', DOB)
    formData.append('userType', option)
    formData.append('phoneNumber', phoneNum)
    setIsLoading(true)
    axios.post('https://zigwa.cleverapps.io/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
      setIsLoading(false)
      if (res.data) {
        if (res.data.errorCode == 0) {

          navigation.navigate('Sign_In')
        } else if (res.data.errorCode == 1) {
          Alert.alert('user is already registered')
        }
      }
      else {
        Alert.alert('connection error!')
      }
    }).catch((err) => { setIsLoading(false); Alert.alert(JSON.stringify(err)); console.error(err) })
  }

  function testsub() {
    navigation.navigate('Test')
  }
  function handleBank() {
    navigation.navigate('Bank', { test: 'testuisdjkghskdh' })
  }
  return (
    <>
      {fontsLoaded ? <View style={styles.container}>
        <Image style={styles.image} source={require("../images/wel.png")} />
        <View style={styles.responsibleforbox}>
          <View style={styles.boxforall}>
            <ScrollView>
              <View>
                <Text style={{ fontFamily: 'bebas', fontSize: 30 }}>Sign Up</Text>
              </View>
              <View style={styles.inp}>
                <View style={styles.boxie}>
                  <TextInput ref={refName} onChangeText={(text) => handleTextChange(text, refName)} style={styles.TextInput} placeholder='Name'></TextInput>
                </View>
                <View style={styles.boxie}>
                  <TextInput ref={refUsername} onChangeText={(text) => handleTextChange(text, refUsername)} style={styles.TextInput} placeholder='UserName'></TextInput>
                </View>
                <View style={styles.boxie}>
                  <TextInput ref={refPassword} secureTextEntry={true} onChangeText={(text) => handleTextChange(text, refPassword)} style={styles.TextInput} placeholder='Password'></TextInput>
                </View>
                <View style={styles.boxie}>
                  <TextInput ref={refPasswordRep} secureTextEntry={true} onChangeText={(text) => handleTextChange(text, refPasswordRep)} style={styles.TextInput} placeholder='Repeat Password'></TextInput>
                </View>
                <View style={styles.boxie}>
                  <TextInput ref={refDOB} onChangeText={(text) => handleTextChange(text, refDOB)} style={styles.TextInput} placeholder='Date Of Birth: YYYY/MM/DD'></TextInput>
                </View>
                <View style={styles.boxie}>
                  <TextInput ref={refPhoneNum} onChangeText={(text) => handleTextChange(text, refPhoneNum)} style={styles.TextInput} placeholder='Phone Number'></TextInput>
                </View>
              </View>
              <View>
                <Picker onValueChange={(item) => { setOption(item) }} selectedValue={option}>
                  <Picker.Item value={null} label='select your role...' ></Picker.Item>
                  <Picker.Item value='collector' label='collector' ></Picker.Item>
                  <Picker.Item value='scrapDealer' label='scrap dealer' ></Picker.Item>
                  <Picker.Item value='citizen' label='citizen' ></Picker.Item>
                </Picker>
              </View>
              <View style={styles.button}>
                <Button color='#5e17eb' title='sign up' onPress={handleSignInButton} />
              </View>
              <View style={styles.button}>
                <Button color='#5e17eb' title='sign in instead' onPress={() => navigation.navigate('Sign_In')} />
              </View>
              <View>
                <Button title='link bank account' onPress={handleBank} />
              </View>
              <View>
                <Button title='test' onPress={testsub}/>
              </View>
            </ScrollView>
          </View>
        </View>
        {isLoading && <LoadingAnimation />}
        <Modal isVisible={modal}>
          <View style={{ alignItems: 'center', backgroundColor: 'white', borderRadius: 5, padding: 10 }}>
            <Text style={{ marginBottom: 10 }}>error, {reason}</Text>
            <Button title='close' onPress={() => { setError(false) }}></Button>
          </View>
        </Modal>
        <StatusBar style="auto" backgroundColor='green' />
      </View>:<LoadingAnimation/>}
    </>
  );
}

const styles = StyleSheet.create({

  coverr: {
    height: 1000,
    top: 30

  },


  button: {
    padding: 10
  },
  boxie: {
    padding: 5
  },
  inp: {
    padding: 10
  },
  responsibleforbox: {
    alignItems: 'center'

  },
  boxforall: {
    backgroundColor: 'white',
    elevation: 20,
    padding: 20,
    bottom: 140,
    width: 350,
    borderRadius: 15,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'stretch',
    justifyContent: 'center',
    borderColor: "black",
    borderWidth: 2,
  },
  TextInput: {
    borderWidth: 1,
    padding: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
    fontFamily: 'bebas'
  },
  image: {
    height: '50%',
    width: '100%',
    alignSelf: 'center',
    top: 70
  },
  text: {
    fontSize: 30,
    top: -10,
    left: 70,
  },
});