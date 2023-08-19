import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, Modal } from "react-native";
import { Button } from "react-native";
import LoadingAnimation from "../LoadingAnimation";
import * as Location from 'expo-location'
import MapView, { Marker, Polyline } from "react-native-maps";
import { useFonts } from 'expo-font'

export default function History({ navigation, route }) {
    const [users, setUsers] = useState([])
    const [citizenGeoLocations, setCitizenGeolocations] = useState([])
    const [collectorGeoLocations, setCollectorGeoLocations] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const [params, setParams] = useState({})
    const [coords, setCoords] = useState()
    const [path, setPath] = useState()
    const [isVisible, setIsVisible] = useState(false)
    const [singleName, setSingleName] = useState()
    const [singleLocC, setSingleLocC] = useState()
    const [singleLocU, setSingleLocU] = useState()

    useEffect(() => {
        (async () => {
            const res = await axios.get(`https://zigwa.cleverapps.io/transactions?citizenUsername=${route.params.params.params.username}`)
            if (res.data.errorCode == 0) {
                if (res.data.userData != 0) {
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
                else {
                    setIsEmpty(true)
                }
            } else
                Alert.alert('something went wrong')
        })()
    }, [])
    async function handleDetails(i) {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('can\'t proceed without location perms')
        } else {
            const { coords } = await Location.getCurrentPositionAsync()
            setCoords({ latitude: coords.latitude, longitude: coords.longitude })
            const options = {
                method: 'GET',
                url: 'https://trueway-directions2.p.rapidapi.com/FindDrivingPath',
                params: {
                    origin: `${coords.latitude},${coords.longitude}`,
                    destination: `${users[i].collectorLocation.latitude},${users[i].collectorLocation.longitude}`
                },
                headers: {
                    'X-RapidAPI-Key': '56e22d04famsh86be36723dd44eep1b9ac7jsn3d05d6b1346d',
                    'X-RapidAPI-Host': 'trueway-directions2.p.rapidapi.com'
                }
            }
            axios.request(options).then((res) => {
                setPath(res.data.route.geometry.coordinates)
                setSingleLocC(collectorGeoLocations[i])
                setSingleLocU(citizenGeoLocations[i])
                setSingleName(users[i].citizenUsername)
                setIsVisible(true)
            })
        }
    }
    return (
        <>
            {isEmpty ?
                <Text>no requests have been made yet</Text> :
                <View style={{ top: 110 }}>
                    {(users[0] != 0) ?
                        <ScrollView>
                            {users.map((e, i) =>
                            (<View key={i} style={{ alignItems: 'center', }} >
                                <Text>collector name: {e.collectorUsername}</Text>
                                <Text>his location: {collectorGeoLocations[i]}</Text>
                                <Text>status: {e.status}</Text>
                                {(e.status === "accepted - onGoing") ?
                                    <Button title="details" onPress={() => handleDetails(i)} /> : <></>}
                            </View>))}
                        </ScrollView> : <LoadingAnimation />}
                </View>}



            <Modal visible={isVisible} >
                <View>
                    {(coords && path) ? <MapView style={{ height: '80%', width: '100%' }} showsUserLocation initialRegion={{
                        latitudeDelta: 0.01990,
                        longitudeDelta: 0.5,
                        latitude: (coords.latitude),
                        longitude: (coords.longitude)
                    }}>
                        <Polyline
                            coordinates={(path.map(([latitude, longitude]) => ({ latitude, longitude })))}
                            strokeColor="#000"
                            strokeWidth={4}
                        />
                        <Marker coordinate={{ latitude: (coords.latitude), longitude: (coords.longitude) }} />
                    </MapView> : <Text>loading....</Text>}
                    <View>
                        <Text>from: {singleName}</Text>
                        <Text>trash location: {singleLocU}</Text>
                        <Text>collector location: {singleLocC}</Text>
                        <Button title="close" onPress={() => setIsVisible(false)} />
                        {/* <Image source={{ uri: 'data:image/png;base64,' + image }} style={{ height: 100, width: 100 }} /> it'll need image handling "***" */}
                    </View>
                </View>
            </Modal>
        </>
    )
}