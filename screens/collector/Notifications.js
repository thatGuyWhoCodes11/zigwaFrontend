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
                    return (
                        <View style={{padding:20}}>
                          <View key={i}>
                          <Text>Username of scrap dealer: {e.scrapUsername}</Text>
                          <Text>Their address: {e.address}</Text>
                    </View>

                        </View>
)
                })
            }
        </ScrollView>
    )
}
