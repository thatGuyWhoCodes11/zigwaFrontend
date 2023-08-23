import axios from "axios";
import { useState } from "react";
import { Text, View, Image, TextInput, Button, Alert } from "react-native";
import LoadingAnimation from "../LoadingAnimation";


export default function Received({ navigation, route }) {
    const [credits, setCredits] = useState()
    const [isLoading, setIsLoading] = useState(false)
    function handlePress() {
        setIsLoading(true)
        if (credits)
            axios.put(`https://zigwa.cleverapps.io/updateCredits?credits=${credits}&citizenUsername=${route.params.citizenUsername}&collectorUsername=${route.params.collectorUsername}`).then((res) => {
                if (res.data.errorCode == 0)
                    axios.put(`https://zigwa.cleverapps.io/notifications?completed=yes&_id=${route.params._id}`).then(async () => {
                        const res2 = await axios.get('https://zigwa.cleverapps.io/transactions')
                        res2.data.userData.some((e, i) => {
                            if (e.image_name === route.params.image_name) {
                                console.log(e._id)
                                axios.put(`https://zigwa.cleverapps.io/updateStatus?status=credits-sent!&_id=${e._id}`).then(() => {
                                    axios.delete(`https://zigwa.cleverapps.io/wrapUp?${e.image_name}`).then(() => {
                                        setIsLoading(false)
                                        navigation.goBack()
                                        Alert.alert('success!')
                                    })
                                })
                                return true;
                            }
                        })
                    }
                    )
            })
        else
            Alert.alert('credits field is required :skull:'); setIsLoading(false)
    }
    return (
        <View>
            <Image source={{ uri: 'data:img/png;base64,' + route.params.image }} style={{ height: 200, width: 200 }} />
            <Text>{route.params.citizenUsername}</Text>
            <Text>{route.params.collectorUsername}</Text>
            <Text>enter the amount of credits: </Text>
            <TextInput placeholder="enter their credits" onChangeText={(text) => setCredits(text)} />
            <Button title="Send" onPress={handlePress} />
            {isLoading && <LoadingAnimation />}
        </View>
    )
}