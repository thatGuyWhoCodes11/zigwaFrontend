import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState, useRef } from 'react';
import Modal from "react-native-modal";
import axios from 'axios'

export default function Sign_Up({ navigation }) {
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
    axios.post('https://zigwa.cleverapps.io/register', formData, { headers: { 'Content-Type': 'multipart/form-data'} }).then((res) => { console.log(res.data) }).catch((err) => { console.log(err) })
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../images/trashcan.jpg")} />
      <Text style={styles.text}>welcome to zigwa</Text>
      <TextInput ref={refName} onChangeText={(text) => handleTextChange(text, refName)} style={styles.TextInput} placeholder='name'></TextInput>
      <TextInput ref={refUsername} onChangeText={(text) => handleTextChange(text, refUsername)} style={styles.TextInput} placeholder='username'></TextInput>
      <TextInput ref={refPassword} secureTextEntry={true} onChangeText={(text) => handleTextChange(text, refPassword)} style={styles.TextInput} placeholder='password'></TextInput>
      <TextInput ref={refPasswordRep} secureTextEntry={true} onChangeText={(text) => handleTextChange(text, refPasswordRep)} style={styles.TextInput} placeholder='repeat password'></TextInput>
      <TextInput ref={refDOB} onChangeText={(text) => handleTextChange(text, refDOB)} style={styles.TextInput} placeholder='date of birth: yyyy/mm/dd'></TextInput>
      <TextInput ref={refPhoneNum} onChangeText={(text) => handleTextChange(text, refPhoneNum)} style={styles.TextInput} placeholder='phone number'></TextInput>
      <Picker onValueChange={(item) => { setOption(item) }} selectedValue={option} style={{fontStyle:'italic'}}>
        <Picker.Item value={null} label='select your role...'></Picker.Item>
        <Picker.Item value='collector' label='collector' ></Picker.Item>
        <Picker.Item value='scrapDealer' label='scrap dealer' ></Picker.Item>
        <Picker.Item value='citizen' label='citizen' ></Picker.Item>
      </Picker>
      <Button title='sign up' onPress={handleSignInButton} />
      <Button title='sign in instead' onPress={() => navigation.navigate('Sign_In')} />
      <Modal isVisible={modal}>
        <View style={{ alignItems: 'center', backgroundColor: 'white', borderRadius: 5, padding: 10 }}>
          <Text style={{ marginBottom: 10 }}>error, {reason}</Text>
          <Button title='close' onPress={() => { setError(false) }}></Button>
        </View>
      </Modal>
      <StatusBar style="auto" backgroundColor='green' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    borderColor: "black",
    borderWidth: 2
  },
  TextInput: {
    borderWidth: 1,
    padding: 1,
    paddingHorizontal: 3
  },
  image: {
    height: 250,
    width: 300,
    alignSelf: 'center'
  },
  text: {
    fontSize: 30,
    top: -10,
    left: 70,
  }
});