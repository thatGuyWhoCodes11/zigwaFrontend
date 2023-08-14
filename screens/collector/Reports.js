import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from 'expo-location'
export default function Reports({ navigation,route }) {
    const [coords, setCoords] = useState(route?.params.coords || null)
    const [path, setPath] = useState([])
    const [userName, setUserName] = useState()
    const [image, setImage] = useState()
    const [userGeoLocation,setUserGeoLocation]=useState()
    useEffect(() => {
        (async () => {
            try {
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
            } catch (error) {
                console.error(error);
            }
            route.params.users.forEach(e => {
                if (e.location.latitude == route.params.coords.latitude) {
                    setUserName(e.username)
                    setImage(e.buffer)
                }
            })
        })()
        return;
    }, [coords])
    function handleCollected(){
        navigation.navigate('Result',{username:userName,location:userGeoLocation,collectorUsername:route.params.collectorUserName,image:image})
    }
    return (
        <View>
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
            </MapView> : <Text>loading....</Text>}
            <View>
                <Text>from: {userName}</Text>
                <Text>trash location: {route.params.geoLocation}</Text>
                <Text>your location: {userGeoLocation}</Text>
                <Image source={{ uri: 'data:image/png;base64,' + image }} style={{ height: 100, width: 100 }} />
                <TouchableOpacity onPress={handleCollected}>
                    <Text>collected</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}