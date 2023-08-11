import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from 'expo-location'
export default function Reports({ route }) {
    const [coords, setCoords] = useState(route?.params || null)
    const [path, setPath] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Please accept location permissions');
                } else {
                    const location = await Location.getCurrentPositionAsync({});
                
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
        })()
        return;
    }, [])
    return (
        <View>
            {coords ? <MapView style={{ height: '80%', width: '100%' }} showsUserLocation initialRegion={{
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

            </View>
        </View>
    )
}