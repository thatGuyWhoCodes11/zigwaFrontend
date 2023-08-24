import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from 'expo-location'
import { useFonts } from 'expo-font'
import LoadingAnimation from "../LoadingAnimation";
export default function Reports({ navigation, route }) {
    const [coords, setCoords] = useState(route?.params.coords || null)
    const [path, setPath] = useState([])
    const [userName, setUserName] = useState()
    const [image, setImage] = useState()
    const [userGeoLocation, setUserGeoLocation] = useState()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        (async () => {
            //get device current location
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Please accept location permissions');
            } else {
                const location = await Location.getCurrentPositionAsync({});
                //get geoLocation
                const res2 = await axios.get(`https://api.maptiler.com/geocoding/${location.coords.longitude},${location.coords.latitude}.json?key=EXraYT9hKOgDIdJtEpJn`)
                const { features: [{ place_name }] } = res2.data
                setUserGeoLocation(place_name)
                //get directions
                const options = {
                    method: 'GET',
                    url: 'https://trueway-directions2.p.rapidapi.com/FindDrivingPath',
                    params: {
                        origin: `${location.coords.latitude},${location.coords.longitude}`,
                        destination: `${coords.latitude},${coords.longitude}`
                    },
                    headers: {
                        'X-RapidAPI-Key': '56e22d04famsh86be36723dd44eep1b9ac7jsn3d05d6b1346d',
                        'X-RapidAPI-Host': 'trueway-directions2.p.rapidapi.com'
                    }
                }
                const response = await axios.request(options)
                setPath(response.data.route.geometry.coordinates)
            }
            route.params.users.forEach(e => {
                if (e.location.latitude == route.params.coords.latitude) {
                    setUserName(e.username)
                    setImage(e.buffer)
                }
            })
            setIsLoading(false)
            console.log('finished!')
        })()
        return;
    }, [])
    function handleCollected() {
        navigation.navigate('Result', { username: userName, location: userGeoLocation, collectorUsername: route.params.collectorUserName, image: image, image_name: route.params.image_name })
    }

    let [fontsLoaded] = useFonts({
        'bebas': require('../../assets/fonts/BebasNeue-Regular.ttf')
    });
    return (
        <>
            {isLoading ?
                <LoadingAnimation /> : <View style={{}}>
                    {(coords && path) ? <MapView style={{ height: '60%', width: '100%' }} showsUserLocation initialRegion={{
                        latitudeDelta: 0.01990,
                        longitudeDelta: 0.5,
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    }}>
                        <Polyline
                            coordinates={(path.map(([latitude, longitude]) => ({ latitude, longitude })))}
                            strokeColor="#000" // Change this to your preferred color
                            strokeWidth={4}
                        />
                        <Marker coordinate={{ latitude: (coords.latitude), longitude: (coords.longitude) }} />
                    </MapView> : <Text style={{ padding: 5, fontFamily: 'bebas' }}>loading....</Text>}
                    <View style={{}}>
                        <View style={{ padding: 15, width: 300, flexDirection: 'row', borderRadius: 15 }}>
                            <View style={{ flexDirection: 'column', borderWidth: 1, borderRadius: 15, borderColor: '#5e17eb', padding: 10 }}>
                                <Text style={{ padding: 5, fontFamily: 'bebas' }}>From: {userName}</Text>
                                <Text style={{ padding: 5, fontFamily: 'bebas' }}>Trash location: {route.params.geoLocation}</Text>
                                <Text style={{ padding: 5, fontFamily: 'bebas' }}>Your location: {userGeoLocation}</Text>
                            </View>
                            <View style={{ flexDirection: "row", padding: 10 }}>
                                <Image source={{ uri: 'data:image/png;base64,' + image }} style={{ height: 100, width: 100, borderRadius: 15, borderWidth: 1, borderColor: '#5e17eb' }} />
                            </View>

                        </View>
                        <TouchableOpacity style={{ padding: 10, fontFamily: 'bebas', alignSelf: 'center', borderWidth: 1, borderColor: '#5e17eb', borderRadius: 15, backgroundColor: '#5e17eb', width: '80%' }} onPress={handleCollected}>
                            <Text style={{ fontFamily: 'bebas', color: 'white', alignSelf: 'center' }}>Collected</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            }
        </>
    )
}