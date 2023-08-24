import {  } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Image, ScrollView, Text, View } from "react-native";

export default function Home({ route, navigation }) {
    const [requests, setRequests] = useState([])
    const [images_requests, setImages_requests] = useState([])
    const [images_orders, setImages_orders] = useState([])
    const [isOrder, setIsOrder] = useState(false)
    const [isRequest, setIsRequest] = useState(false)
    const [orders, setOrders] = useState([])
    useEffect(() => {
        (async () => {
            const res = await axios.get('https://zigwa.cleverapps.io/notifications')
            if (res.data.errorCode == 0) {
                if (res.data.userData.length != 0) {
                    setIsRequest(true)
                    setIsOrder(true)
                    res.data.userData.forEach(async (e) => {
                        if (e.completed != 'yes') {
                            if (e.accepted != 'yes') {
                                const res2 = await axios.get(`https://zigwa.cleverapps.io/location?image_name=${e.image_name}`)
                                if (res2.data.errorCode == 0 && res2.data.doc.length != 0) {
                                    setRequests(prev => [...prev, e])
                                    setImages_requests((prev) => [...prev, res2.data.doc[0].buffer])
                                }
                            }
                            else {
                                const res2 = await axios.get(`https://zigwa.cleverapps.io/location?image_name=${e.image_name}`)
                                setImages_orders(prev => [...prev, res2.data.doc[0].buffer])
                                setOrders(prev => [...prev, e])
                            }
                        }
                    })
                }
            }
            else {
                Alert.alert('something went wrong')
                console.log(res.data)
            }
        })()
    }, [navigation.params])
    function handleDetails(i) {
        navigation.navigate('Details', { image: images_requests[i], citizenUsername: requests[i].citizenUsername, collectorUsername: requests[i].collectorUsername, description: requests[i].description, scrapUsername: route.params.username, _id: requests[i]._id })
    }
    function handleReceived(i) {
        navigation.navigate('Received', { image: images_orders[i], citizenUsername: orders[i].citizenUsername, collectorUsername: orders[i].collectorUsername, scrapUsername: route.params.username, _id: orders[i]._id,image_name:orders[i].image_name })
    }
    function handleDetails2(e){
        navigation.navigate('Details2',e)
    }
    return (
        <View>
            <Text>welcome! {route.params.username}</Text>
            {isRequest ?
                <ScrollView horizontal={true}>
                    {
                        requests.map((e, i) => (
                            <View key={i} >
                                <Image source={{ uri: 'data:image/png;base64,' + images_requests[i] }} style={{ height: 150, width: 150 }} />
                                <Button title="Details" onPress={() => handleDetails(i)} />
                            </View>
                        ))
                    }
                </ScrollView> : <Text>requests are currently empty</Text>}
            {isOrder ?
                <View>
                    <Text>orders: </Text>
                    <ScrollView horizontal={true}>
                        {
                            orders.map((e, i) => (
                                <View key={i} >
                                    <Image style={{ height: 150, width: 150 }} source={{ uri: 'data:img/png;base64,' + images_orders[i] }} />
                                    <Text>collector name: {e.collectorUsername}</Text>
                                    <Button title="Details" onPress={()=>handleDetails2(e)} />
                                    <Button title="received" onPress={() => handleReceived(i)} />
                                </View>
                            ))
                        }
                    </ScrollView>
                </View> : <Text>orders are currently empty</Text>
            }
        </View>
    )
}