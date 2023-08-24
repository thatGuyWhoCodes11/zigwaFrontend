import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, Modal, Image } from "react-native";
import { Button } from "react-native";
import LoadingAnimation from "../LoadingAnimation";
import * as Location from 'expo-location'
import MapView, { Marker, Polyline } from "react-native-maps";
import { useFonts } from 'expo-font'
import { useQuery } from "@tanstack/react-query";
import { GetGeoLocationArray, SearchByImgNameArray, TransactionsSearchByCitizen } from "../../ApiCalls";

export default function History({ navigation, route }) {
    const [users, setUsers] = useState([])
    const [isEmpty, setIsEmpty] = useState(false)
    const [params, setParams] = useState({})
    const [coords, setCoords] = useState()
    const [path, setPath] = useState()
    const [isVisible, setIsVisible] = useState(false)
    const [singleName, setSingleName] = useState()
    const [singleLocC, setSingleLocC] = useState()
    const [singleLocU, setSingleLocU] = useState()
    const [citizenLocations, setCitizenLocations] = useState([])
    const [collectorLocations, setCollectorLocations] = useState([])

    const { data: transactions, isLoading: isTransLoading } = useQuery({
        queryKey: ['transactions', route.params.params.params.username],
        queryFn: TransactionsSearchByCitizen,
        staleTime: 10000
    })
    console.log(transactions.length != 0)
    if (!isTransLoading) {
        if (transactions.length != 0) {
            setCitizenLocations(transactions.map((e) => e.citizenLocation))
            setCollectorLocations(transactions.map((e) => e.collectorLocation))
            setUsers(transactions)
        }
    }
    const { data: images, isLoading: isImgLoading } = useQuery({
        queryKey: ['locations', transactions],
        queryFn: SearchByImgNameArray,
        staleTime: 10000,
        enabled: transactions.length != 0
    })
    const { data: citizenGeoLocations, isLoading: isCitizenGeoLoading } = useQuery({
        queryKey: ['citizenGeoLocation', citizenLocations],
        queryFn: GetGeoLocationArray,
        staleTime: 10000,
        enabled: transactions.length != 0
    })
    const { data: collectorGeoLocations, isLoading: isCollectorGeoLoading } = useQuery({
        queryKey: ['collectorGeoLocation', collectorLocations],
        queryFn: GetGeoLocationArray,
        staleTime: 10000,
        enabled: transactions.length != 0
    })

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

    let [fontsLoaded] = useFonts({
        'bebas': require('../../assets/fonts/BebasNeue-Regular.ttf')
      });


    if (isTransLoading)
        return (<LoadingAnimation />)
    if (transactions.length == 0) {
        return (<View style={{ top: 110 }} >
            <Text>
                empty
            </Text>
        </View>)
    }
    return (
        <>
            <View style={{ top: 110 }}>
                <ScrollView>
                    {users.map((e, i) =>
                    (<View key={i} style={{ alignItems: 'center',padding:20 }} >
                        <Image source={{ uri: 'data:img/png;base64,' + images[i] }} style={{ height: 100, width: 100 }} />
                        <View style={{padding:20,borderWidth:1,borderRadius:15,borderColor:'#5e17eb'}}>
                                  <Text style={{fontFamily:'bebas',fontSize:15}}>Collector name: {e.collectorUsername}</Text>
                          <Text style={{fontFamily:'bebas',fontSize:15}}>Location: {collectorGeoLocations[i]}</Text>
                          <Text style={{fontFamily:'bebas',fontSize:15,alignSelf:'center',padding:10}}>Status: {e.status}</Text>
                          {(e.status === "accepted - onGoing") ?
                              <Button title="details" onPress={() => handleDetails(i)} /> : <></>}
                                  </View>
                    </View>))}
                </ScrollView>
            </View>
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