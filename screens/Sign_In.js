import { View, Text, Button, TextInput } from "react-native";
import { useState, useRef } from "react";
import axios from "axios";
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
    return (
        <View>
            <TextInput placeholder="username" onChangeText={(text) => handleText(text, refUsername)} ref={refUsername} />
            <TextInput placeholder="password" secureTextEntry onChangeText={(text) => handleText(text, refPassword)} ref={refPassword} />
            <Button title="sign in" onPress={sendCredits} />
            <Button title="sign up instead" onPress={() => navigation.goBack()} />
        </View>
    )
}