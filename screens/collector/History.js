import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import LoadingAnimation from "../LoadingAnimation";
import { useFonts } from 'expo-font'


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
        if (users[i].status === 'accepted - onGoing')
            navigation.navigate('Accept_details', params)
        else if (users[i].status === 'complete')
            navigation.navigate('Result', { username: users[i].citizenUsername, location: citizenGeoLocations[i], collectorUsername: users[i].collectorUsername, image_name: users[i].image_name })
    }

    let [fontsLoaded] = useFonts({
        'bebas': require('../../assets/fonts/BebasNeue-Regular.ttf')
    });

    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            {(users[0] != 0) ?
                <ScrollView style={{ padding: 20 }}>
                    {users.map((e, i) =>
                    (<View key={i} style={{ padding: 10 }}>


                        <View style={{ alignItems: 'center', borderWidth: 1, padding: 15, borderRadius: 15, borderColor: '#5e17eb' }} >
                            <Text style={{ fontFamily: 'bebas', fontSize: 15, padding: 5 }}>The Person who reported the trash: {e.citizenUsername}</Text>
                            <Text style={{ fontFamily: 'bebas', fontSize: 15, padding: 5 }}>Location: {citizenGeoLocations[i]}</Text>
                            <Text style={{ fontFamily: 'bebas', fontSize: 15, padding: 10 }}>Status: {e.status}</Text>
                            <View style={{ padding: 15 }}>
                                <TouchableOpacity onPress={() => handleDetails(i)} style={{ alignSelf: 'center', padding: 20, borderWidth: 1, borderColor: '#5e17eb', backgroundColor: '#5e17eb', width: '75%', borderRadius: 15 }}>
                                    <Text style={{ color: 'white', fontFamily: 'bebas', alignSelf: 'center' }}>Details</Text>
                                </TouchableOpacity>

                            </View>

                        </View>

                    </View>

                    ))}


                </ScrollView> : <LoadingAnimation />}
        </View>
    )
}