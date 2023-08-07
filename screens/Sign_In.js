import { View, Text, Button, TextInput, StyleSheet, ImageBackground } from "react-native";
import { useState, useRef } from "react";
import axios from "axios";
import { useFonts } from 'expo-font'
import AppLoading from "expo-app-loading";
export default function Sign_In({ navigation }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const refUsername = useRef('')
    const refPassword = useRef('')
    function handleText(text, ref) {
        if (ref === refUsername)
            setUsername(text)
        else if (ref === refPassword)
            setPassword(text)
    }
    function sendCredits() {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        axios.post('https://zigwa.cleverapps.io/login', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
            if (res.data.errorCode == 0) {
                switch (res.data.userData.userType) {
                    case 'citizen':
                        navigation.navigate('Citizen', { params: res.data.userData })
                        break;
                    case 'scrapDealer':
                        navigation.navigate('Scrap_Dealer')
                        break;
                    case 'Collector':
                        navigation.navigate('Collector')
                        break;
                    default:
                        console.log("no such thing is proccessed")
                }
            } else {
                console.log(res.data)
            }
        }).catch((err) => { console.log(err) })
    }

    let [fontsLoaded] = useFonts({
        'bebas': require('../assets/fonts/BebasNeue-Regular.ttf')
      });
      if (!fontsLoaded) {
        return <AppLoading />;
      }

    return (
        <ImageBackground style={styles.cover} source={require('../images/welb.jpeg')}>
        <View style={styles.all}>
            
              <View style={styles.box}>
                  <View>
                      <Text style={{fontFamily:'bebas',fontSize:30}}>Welcome back!</Text>
                  </View>
                <View style={{padding:10}}>
                  <TextInput style={{borderRadius:5,fontFamily:'bebas',borderWidth:.5,padding:5}}placeholder="Username" onChangeText={(text) => handleText(text, refUsername)} ref={refUsername} />
                </View>
                <View style={{padding:10}}> 
                  <TextInput style={{borderRadius:5,fontFamily:'bebas',borderWidth:.5,padding:5}} placeholder="Password" secureTextEntry onChangeText={(text) => handleText(text, refPassword)} ref={refPassword} />
                </View>
                <View style={{padding:10}}>
                  <Button color='#5e17eb' title="sign in" onPress={sendCredits} />
                </View>
                <View style={{padding:10}}>
                  <Button color='#5e17eb' title="sign up instead" onPress={() => navigation.goBack()} />
                </View>
              
              
            </View>

            



        </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'white',
        elevation: 20,
        padding: 20,
        top:225,
        borderRadius: 15,
        width:350,
        alignContent:'center',
        fontFamily:'bebas'
    },

    all: {
        alignItems:'center',
    },
    
    cover: {
        height:1000,
        top:30
        
    }
})