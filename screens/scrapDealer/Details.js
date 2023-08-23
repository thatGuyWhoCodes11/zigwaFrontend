import axios from "axios";
import { useState } from "react";
import { Text, View, Image, Button, TextInput } from "react-native";
import { Alert } from "react-native";
import LoadingAnimation from "../LoadingAnimation";

export default function Details({ route, navigation }) {
    const [isLoading, setIsLoading] = useState(false)
    const [address, setAddress] = useState('')
    console.log(route.params)
    function handlePress() {
        if (!address) {
            Alert.alert('address is required')
            return;
        }
        setIsLoading(true)
        formData = new FormData
        formData.append('scrapUsername', route.params.scrapUsername)
        formData.append('address', address)
        axios.post('https://zigwa.cleverapps.io/collectorNotif', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(async (res) => {
            if (res.data.errorCode == 0) {
                const res = await axios.put(`https://zigwa.cleverapps.io/notifications?_id=${route.params._id}`)
                if (res.data.errorCode == 0) {
                    Alert.alert('success')
                    navigation.goBack()
                }
                else
                    Alert.alert('an error happened!');
            }
            else
                Alert.alert('an error happened!');
        })
        setIsLoading(false)
    }
    return (
        <>
            {isLoading && <LoadingAnimation />}
            <View>
                <Image source={{ uri: 'data:img/png;base64,' + route.params.image }} style={{ height: 150, width: 150 }} />
                <Text>citizen name: {route.params.citizenUsername}</Text>
                <Text>collector name: {route.params.collectorUsername}</Text>
                <Text>description: {route.params.description}</Text>
                <TextInput placeholder="enter your address" onChangeText={(Text) => setAddress(Text)} />
                <Button title="order" onPress={handlePress} />
            </View>
        </>
    )
}