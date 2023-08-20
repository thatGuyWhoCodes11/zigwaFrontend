import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Image, ScrollView, Text, View } from "react-native";

export default function Home({ route }) {
    const [requests, setRequests] = useState([])
    const [images, setImages] = useState([])
    const [isOrder, setIsOrder] = useState(false)
    const [orders, setOrders] = useState([])
    useEffect(() => {
        (async () => {
            const res = await axios.get('https://zigwa.cleverapps.io/notifications')
            if (res.data.errorCode == 0 && res.data.userData != 0) {
                setRequests(res.data.userData)
                res.data.userData.forEach(async (e) => {
                    const res2 = await axios.get(`https://zigwa.cleverapps.io/location?image_name=${e.image_name}`)
                    if (res2.data.errorCode == 0 && res2.data.doc != []) {
                        setImages((prev) => [...prev, res2.data.doc[0].buffer])
                    }
                })
                if(requests!=[]&&images!=[])
                    setIsOrder[true]
            } else {
                Alert.alert('something went wrong')
                console.log(res.data)
            }
        })()
    }, [])
    console.log(requests,images)
    return (
        <View>
            <Text>welcome! {route.params.username}</Text>
            {/* wrap a data array around it to display shit */}
            <ScrollView horizontal={true}>
                {
                    requests.map((e, i) => (
                        <View>
                            <Image source={{uri:'data:image/png;base64'+images[i]}} />
                            <Button title="Details" />
                        </View>
                    ))
                }
            </ScrollView>
            {isOrder ?
                <View>
                    <Text>orders: </Text>
                    <ScrollView horizontal={true}>

                    </ScrollView>
                </View> : <Text>orders: currently nothing</Text>
            }
        </View>
    )
}