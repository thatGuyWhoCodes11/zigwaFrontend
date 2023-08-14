import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Button } from "react-native";
import LoadingAnimation from "../LoadingAnimation";

export default function AcceptedList({navigation,route}) {
    const [users, setUsers] = useState([])
    const [citizenGeoLocations, setCitizenGeolocations] = useState([])
    const [collectorGeoLocations, setCollectorGeoLocations] = useState([])
    useEffect(() => {
        (async () => {
            const res = await axios.get('https://zigwa.cleverapps.io/transactions')
            if (res.data.errorCode == 0) {
                res.data.userData.forEach(async (e) => {
                    if (e.status === "accepted - onGoing") {
                        setUsers(prev => [...prev, e])
                        {
                            const resCitizen = await axios.get(`https://api.maptiler.com/geocoding/${e.citizenLocation.longitude},${e.citizenLocation.latitude}.json?key=EXraYT9hKOgDIdJtEpJn`)
                            const { features: [{ place_name }] } = resCitizen.data
                            setCitizenGeolocations(prev => [...prev, place_name])
                        }
                        const resCollector = await axios.get(`https://api.maptiler.com/geocoding/${e.collectorLocation.longitude},${e.collectorLocation.latitude}.json?key=EXraYT9hKOgDIdJtEpJn`)
                        const { features: [{ place_name }] } = resCollector.data
                        setCollectorGeoLocations(prev => [...prev, place_name])
                    }
                })
            }
        })()
    }, [])
    function handleDetails(i){
        const params={user:users[i],citizenGeoLocation:citizenGeoLocations[i],collectorGeoLocation:collectorGeoLocations[i]}
        navigation.navigate('Accept_details',params)
    }
    return (
        <View>
            {(citizenGeoLocations && collectorGeoLocations && users) ?
                <ScrollView>
                    {users.map((e, i) =>
                    (<View key={i} style={{ alignItems: 'center' }} >
                        <Text>the guy who reported the trash: {e.citizenUsername}</Text>
                        <Text>his location: {citizenGeoLocations[i]}</Text>
                        <Button title="details" onPress={()=>handleDetails(i)} />
                    </View>))}
                </ScrollView> : <LoadingAnimation />}
        </View>
    )
}