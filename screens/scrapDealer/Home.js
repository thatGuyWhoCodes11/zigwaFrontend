import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, Text, View } from "react-native";

export default function Home({ route }) {
    const [requests, setRequests] = useState([])
    const [images, setImages] = useState({})
    useEffect(() => {
        (async () => {
            const res = await axios.get('https://zigwa.cleverapps.io/notifications')
            if (res.data.errorCode == 0 && res.data.userData != []) {
                setRequests(res.data.userData)
                res.data.userData.forEach(async (e) => {
                    const res2 = await axios.get(`https://zigwa.cleverapps.io/location?image_name=${e.image_name}`)
                    if (res2.data.errorCode == 0 && res2.data.doc != []) {
                        setImages((prev)=>[...prev,res2.data.doc[0].buffer])
                    }
                })
            } else {
                Alert.alert('something went wrong')
                console.log(res.data)
            }
        })()
    },[])
    
    return (
        <View>
            <Text>welcome! {route.params.username}</Text>
            {/* wrap a data array around it to display shit */}
            <ScrollView horizontal={true}>

            </ScrollView>
        </View>
    )
}