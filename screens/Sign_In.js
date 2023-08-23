import { View, Text, Button, TextInput, StyleSheet, ImageBackground, Alert } from "react-native";
import { useState, useRef } from "react";
import axios from "axios";
import { useFonts } from 'expo-font'
import LoadingAnimation from "./LoadingAnimation";
export default function Sign_In({ navigation }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
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
        setIsLoading(true)
        axios.post('https://zigwa.cleverapps.io/login', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
            setIsLoading(false)
            if (res.data.errorCode == 0) {
                switch (res.data.userData.userType) {
                    case 'citizen':
                        navigation.navigate('CitizenDrawer', { params: res.data.userData })
                        break;
                    case 'scrapDealer':
                        navigation.navigate('ScrapDealerStack', res.data.userData)
                        break;
                    case 'collector':
                        navigation.navigate('CollectorStack', { params: res.data.userData })
                        break;
                    default:
                        Alert.alert('error: contact the tech support')
                }
            } else {
                Alert.alert('error: contact the tech support')
            }
        }).catch((err) => { setIsLoading(false); Alert.alert('check your internet connection and try again') })
    }

    let [fontsLoaded] = useFonts({
        'bebas': require('../assets/fonts/BebasNeue-Regular.ttf')
    });
    return (
        <ImageBackground style={styles.cover} source={require('../images/welb.jpeg')}>
            {isLoading && <LoadingAnimation/>}
            {fontsLoaded ?
            <View style={styles.all}>
                <View style={styles.box}>
                    <View>
                        <Text style={{ fontFamily: 'bebas', fontSize: 30 }}>Welcome back!</Text>
                    </View>
                    <View style={{ padding: 10 }}>
                        <TextInput style={{ borderRadius: 5, fontFamily: 'bebas', borderWidth: .5, padding: 5 }} placeholder="Username" onChangeText={(text) => handleText(text, refUsername)} ref={refUsername} />
                    </View>
                    <View style={{ padding: 10 }}>
                        <TextInput style={{ borderRadius: 5, fontFamily: 'bebas', borderWidth: .5, padding: 5 }} placeholder="Password" secureTextEntry onChangeText={(text) => handleText(text, refPassword)} ref={refPassword} />
                    </View>
                    <View style={{ padding: 10 }}>
                        <Button color='#5e17eb' title="sign in" onPress={sendCredits} />
                    </View>
                    <View style={{ padding: 10 }}>
                        <Button color='#5e17eb' title="sign up instead" onPress={() => navigation.goBack()} />
                    </View>
                </View>
            </View>: <LoadingAnimation/>}
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'white',
        elevation: 20,
        padding: 20,
        top: 225,
        borderRadius: 15,
        width: 350,
        alignContent: 'center',
        fontFamily: 'bebas'
    },

    all: {
        alignItems: 'center',
    },

    cover: {
        height: 1000,
        top: 30

    }
})