import { useEffect, useState } from "react"
import { Text, View, Image, TouchableOpacity,Alert } from "react-native"
import MapView, { Marker, Polyline } from 'react-native-maps'
import * as Location from 'expo-location'
import axios from "axios"
import { useFonts } from 'expo-font'
import LoadingAnimation from "../LoadingAnimation";
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
        console.log(route.params)
        const res=await axios.put(`https://zigwa.cleverapps.io/transactions?id=${route.params.user._id}&updatedStatus=complete`)//updating status in server
        if(res.data.errorCode==0)
            navigation.navigate('Result',{username:route.params.user.citizenUsername,location:route.params.citizenGeoLocation,collectorUsername:route.params.user.collectorUsername,image_name:route.params.user.image_name})
        else{
            Alert.alert('something went wrong')
        }
    }


    let [fontsLoaded] = useFonts({
        'bebas': require('../../assets/fonts/BebasNeue-Regular.ttf')
      });
    return (
        <View>
            <View>
                {(coords && path) ? <MapView style={{ height: '60%', width: '100%' }} showsUserLocation initialRegion={{
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
                </MapView> : <Text>Loading....</Text>}
                <View style={{}}>
            <View style={{padding:15,width:300,flexDirection:'row',borderRadius:15}}>
                <View style={{flexDirection:'column',borderWidth:1,borderRadius:15,borderColor:'#5e17eb',padding:10}}>
                  <Text style={{padding:5,fontFamily:'bebas'}}>From: {route.params.user.citizenUsername}</Text>
                  <Text style={{padding:5,fontFamily:'bebas'}}>Trash location: {route.params.citizenGeoLocation}</Text>
                  <Text style={{padding:5,fontFamily:'bebas'}}>Your location: {route.params.collectorGeoLocation}</Text>
                </View>

            </View>
            <TouchableOpacity style={{padding:10,fontFamily:'bebas',alignSelf:'center',borderWidth:1,borderColor:'#5e17eb',borderRadius:15,backgroundColor:'#5e17eb',width:'80%'}} onPress={handleCollected}>
                <Text style={{fontFamily:'bebas',color:'white',alignSelf:'center'}}>Collected</Text>
            </TouchableOpacity>

            </View>
            </View>
        </View>
    )
}