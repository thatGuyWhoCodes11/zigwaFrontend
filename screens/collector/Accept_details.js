import { useEffect, useState } from "react"
import { Text, View, Image, TouchableOpacity,Alert } from "react-native"
import MapView, { Polyline } from 'react-native-maps'
import * as Location from 'expo-location'
export default function Accept_details({navigation,route}) {
    const [coords, setCoords] = useState()
    const [path, setPath] = useState()
    const [image, setImage] = useState()
    useEffect(() => {
        (async () => {
            const { status } = Location.requestForegroundPermissionsAsync()
            if (status != 'granted') {
                navigation.goBack()
                Alert.alert('can\'t proceed without location perms')
            } else {
                const {coords}=await Location.getCurrentPositionAsync()
                setCoords({latitude:coords.latitude,longitude:coords.longitude})
                //TODO, handle paths between citizen and collector
            }
        })()
    },[])
    return (
        <View>
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
        </View>
    )
}