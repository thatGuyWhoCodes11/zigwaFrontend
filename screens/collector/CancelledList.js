import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import LoadingAnimation from "../LoadingAnimation";

export default function CancelledList() {
    const [users, setUsers] = useState([])
    const [citizenGeoLocations, setCitizenGeolocations] = useState([])
    const [collectorGeoLocations, setCollectorGeoLocations] = useState([])
    useEffect(() => {
        (async () => {
            const res = await axios.get('https://zigwa.cleverapps.io/transactions')
            if (res.data.errorCode == 0 && res.data.userData.length) {
                res.data.userData.forEach(async (e) => {
                    if (e.status === "cancelled , no longer tracked") {
                        setUsers(res.data.userData)
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
        return;
    }
        , [])
    console.log(citizenGeoLocations.length)
    return (
        <View>
            <View>
                {(users) ?
                    (<ScrollView>
                        {users.map((e, i) =>
                        (<View key={i} style={{ alignItems: 'center' }} >
                            <Text>the guy who reported the trash: {e.citizenUsername}</Text>
                            <Text>his location: {citizenGeoLocations[i]}</Text>
                        </View>)
                        )}
                    </ScrollView>) : (<Text>Loading.....</Text>)}
            </View>
        </View>
    )
}