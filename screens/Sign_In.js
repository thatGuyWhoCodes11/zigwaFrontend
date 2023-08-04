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
        const formData = new FormData
        formData.append('username', username)
        formData.append('password', password)
        axios.post('https://zigwa.cleverapps.io/login', formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((res) => console.log(res.data)).catch((err) => console.error(err.message))
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