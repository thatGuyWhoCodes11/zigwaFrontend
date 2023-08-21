import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Image, ScrollView, Text, View } from "react-native";

export default function Home({ route,navigation }) {
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
                    if (res2.data.errorCode == 0 && res2.data.doc.length != 0) {
                        setImages((prev) => [...prev, res2.data.doc[0].buffer])
                    }
                })
                if (requests.length != 0 && images.length != 0)
                    setIsOrder[true]
            } else {
                Alert.alert('something went wrong')
                console.log(res.data)
            }
        })()
    }, [useIsFocused])
    function handleDetails(i){
        navigation.navigate('Details',{image:images[i],citizenUsername:requests[i].citizenUsername,collectorUsername:requests[i].collectorUsername,description:requests[i].description,scrapUsername:route.params.username,_id:requests[i]._id})
    }
    return (
        <View>
            <Text>welcome! {route.params.username}</Text>
            <ScrollView horizontal={true}>
                {
                    requests.map((e, i) => (
                        <View key={i} >
                            <Image source={{ uri: 'data:image/png;base64,' + images[i] }} style={{height:150,width:150}} />
                            <Button title="Details" onPress={()=>handleDetails(i)} />
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