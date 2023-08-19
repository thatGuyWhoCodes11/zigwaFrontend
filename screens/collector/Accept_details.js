import { useEffect, useState } from "react"
import { Text, View, Image, TouchableOpacity,Alert } from "react-native"
import MapView, { Marker, Polyline } from 'react-native-maps'
import * as Location from 'expo-location'
import axios from "axios"
export default function Accept_details({navigation,route}) {
    const [coords, setCoords] = useState()
    const [path, setPath] = useState()
    // const [image, setImage] = useState() will use later if needed, seek this symbol ---> "***"
    useEffect(() => {
        (async () => {
            const {status} =await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                navigation.goBack()
                Alert.alert('can\'t proceed without location perms')
            } else {
                const {coords}=await Location.getCurrentPositionAsync()
                setCoords({latitude:coords.latitude,longitude:coords.longitude})
                const options = {
                    method: 'GET',
                    url: 'https://trueway-directions2.p.rapidapi.com/FindDrivingPath',
                    params: {
                        origin: `${coords.latitude},${coords.longitude}`,
                        destination: `${route.params.user.citizenLocation.latitude},${route.params.user.citizenLocation.longitude}`
                    },
                    headers: {
                        'X-RapidAPI-Key': '56e22d04famsh86be36723dd44eep1b9ac7jsn3d05d6b1346d',
                        'X-RapidAPI-Host': 'trueway-directions2.p.rapidapi.com'
                    }
                }
                const response = await axios.request(options)
                setPath(response.data.route.geometry.coordinates)
            }
        })()
    },[])
    async function handleCollected(){
        const res=await axios.put(`https://zigwa.cleverapps.io/transactions?id=${route.params.user._id}&updatedStatus=complete`)//updating status in server
        if(res.data.errorCode==0)
            navigation.navigate('Result',{username:route.params.user.citizenUsername,location:route.citizenGeoLocation,collectorUsername:route.params.user.collectorUsername})
        else{
            Alert.alert('something went wrong')
        }
    }
    return (
        <View>
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
                    <Text>From: {route.params.user.citizenUsername}</Text>
                    <Text>Trash location: {route.params.citizenGeoLocation}</Text>
                    <Text>Your location: {route.params.collectorGeoLocation}</Text>
                    {/* <Image source={{ uri: 'data:image/png;base64,' + image }} style={{ height: 100, width: 100 }} /> it'll need image handling "***" */}
                    <TouchableOpacity onPress={handleCollected}>
                        <Text>Collected</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}