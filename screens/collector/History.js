import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Button } from "react-native";
import LoadingAnimation from "../LoadingAnimation";

export default function History({ navigation, route }) {
    const [users, setUsers] = useState([])
    const [citizenGeoLocations, setCitizenGeolocations] = useState([])
    const [collectorGeoLocations, setCollectorGeoLocations] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        (async () => {
            const res = await axios.get('https://zigwa.cleverapps.io/transactions')
            if (res.data.errorCode == 0) {
                res.data.userData.forEach(async (e) => {
                    setUsers(prev => [...prev, e])
                    {
                        const resCitizen = await axios.get(`https://api.maptiler.com/geocoding/${e.citizenLocation?.longitude},${e.citizenLocation.latitude}.json?key=EXraYT9hKOgDIdJtEpJn`)
                        const { features: [{ place_name }] } = resCitizen.data
                        setCitizenGeolocations(prev => [...prev, place_name])
                    }
                    const resCollector = await axios.get(`https://api.maptiler.com/geocoding/${e.collectorLocation?.longitude},${e.collectorLocation.latitude}.json?key=EXraYT9hKOgDIdJtEpJn`)
                    const { features: [{ place_name }] } = resCollector.data
                    setCollectorGeoLocations(prev => [...prev, place_name])
                })
            }
        })()
    }, [])
    function handleDetails(i) {
        const params = { user: users[i], citizenGeoLocation: citizenGeoLocations[i], collectorGeoLocation: collectorGeoLocations[i] }
        if(users[i].status==='accepted - onGoing')
            navigation.navigate('Accept_details', params)
        else if(users[i].status==='complete')
            navigation.navigate('Result',{username:users[i].citizenUsername,location:citizenGeoLocations[i],collectorUsername:users[i].collectorUsername})
    }
    return (
        <View>
            {(users[0]!=0) ?
                <ScrollView>
                    {users.map((e, i) =>
                    (<View key={i} style={{ alignItems: 'center' }} >
                        <Text>the guy who reported the trash: {e.citizenUsername}</Text>
                        <Text>his location: {citizenGeoLocations[i]}</Text>
                        <Text>status: {e.status}</Text>
                        <Button title="details" onPress={() => handleDetails(i)} />
                    </View>))}
                </ScrollView> : <LoadingAnimation />}
        </View>
    )
}