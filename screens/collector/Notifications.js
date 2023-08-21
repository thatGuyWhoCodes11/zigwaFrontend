import axios from "axios";
import { useEffect, useState} from "react";
import { Text,View, ScrollView} from "react-native";

export default function Notifications() {
    const [notifications, setNotifications] = useState([])
    useEffect(() => {
        (async ()=>{
        const res = await axios.get('https://zigwa.cleverapps.io/collectorNotif')
        if (res.data.errorCode == 0) {
            setNotifications(res.data.userData)
        }
        else
            console.log('error')})()
    },[])
    console.log(notifications)
    return (
        <ScrollView>
            {
                notifications.map((e,i) => {
                    return (<View key={i}>
                        <Text>username of scrap dealer: {e.scrapUsername}</Text>
                        <Text>their address: {e.address}</Text>
                    </View>)
                })
            }
        </ScrollView>
    )
}
