import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Image, ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location'
import LoadingAnimation from '../LoadingAnimation';

export default function Home({ route, navigation }) {
    const [users, setUsers] = useState([])
    const [userGeoLocation, setUserGeoLocation] = useState([])
    const [coords, setCoords] = useState([])
    const [citizens, setCitizens] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        try {
            (async () => {
                let flag = false
                const res = await axios.get('https://zigwa.cleverapps.io/location')
                if (res.data.errorCode == 0) {
                    let location = []
                    setCitizens(res.data.doc)
                    res.data.doc.forEach(async (e) => {
                        //TODO make transactions table checking here so that it doesn't show to collector if he accepts user request
                        const res = await axios.get(`https://zigwa.cleverapps.io/transactions?citizenUsername=${e.username}`)
                        if (res.data.userData.length != 0) {
                            res.data.userData.forEach((e2) => {
                                if (e2.citizenLocation.latitude !== e.location.latitude) {
                                    location.push(e.location);
                                    setUsers(prev => [...prev, e])
                                }
                            })
                        } else {
                            flag = true
                            location.push(e.location)
                            setUsers(prev => [...prev, e])
                            setCoords(location)
                            location.forEach(async (e) => {
                                const res2 = await axios.get(`https://api.maptiler.com/geocoding/${e.longitude},${e.latitude}.json?key=EXraYT9hKOgDIdJtEpJn`)
                                const { features: [{ place_name }] } = res2.data
                                setUserGeoLocation(prev => [...prev, place_name])
                            })
                        }
                    })
                    if (flag) {
                        setCoords(location)
                        location.forEach(async (e) => {
                            const res2 = await axios.get(`https://api.maptiler.com/geocoding/${e.longitude},${e.latitude}.json?key=EXraYT9hKOgDIdJtEpJn`)
                            const { features: [{ place_name }] } = res2.data
                            setUserGeoLocation(prev => [...prev, place_name])
                        })
                    }
                }
                else
                    alert('failed connecting to server')
            })()
        } catch (err) { alert(JSON.stringify(err)); console.log(err) }
        return;
    }, [])
    async function HandleAccept(i) {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('warning, cannot function without location perms, please allow location')
        } else {
            const located = await Location.getCurrentPositionAsync()
            const formData = new FormData()
            formData.append('status', 'accepted - onGoing')
            formData.append('collectorLocation', `{"latitude":${located.coords.latitude},"longitude":${located.coords.longitude}}`)
            formData.append('citizenLocation', `{"latitude":${coords[i].latitude},"longitude":${coords[i].longitude}}`)
            const target = citizens.find((e) => (e.location.latitude == coords[i].latitude))
            formData.append('citizenUsername', target.username)
            formData.append('collectorUsername', route.params.username)
            console.log(formData)
            axios.post('https://zigwa.cleverapps.io/transactions', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
                if (res.data?.errorCode == 0) {
                    navigation.navigate('Reports', { coords: coords[i], users: users, geoLocation: userGeoLocation[i], collectorUserName: route.params.username })
                } else {
                    Alert.alert('something went wrong!')
                }
            }).catch((err) => { console.log(err); Alert.alert('error: connnection error, make sure you are connected to internet') })
        }
    }
    async function handleCancel(i) {
        const res = await axios.delete(`https://zigwa.cleverapps.io/location?latitude=${users[i]?.location?.latitude}`)
        if (res.data.errorCode == 0) {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert('warning, cannot function without location perms, please allow location')
            } else {
                const located = await Location.getCurrentPositionAsync()
                const formData = new FormData()
                formData.append('status', 'cancelled , no longer tracked')
                formData.append('collectorLocation', `{"latitude":${located.coords.latitude},"longitude":${located.coords.longitude}}`)
                formData.append('citizenLocation', `{"latitude":${coords[i].latitude},"longitude":${coords[i].longitude}}`)
                const target = citizens.find((e) => (e.location.latitude == coords[i].latitude))
                formData.append('citizenUsername', target.username)
                formData.append('collectorUsername', route.params.username)
                console.log(formData)
                axios.post('https://zigwa.cleverapps.io/transactions', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
                    if (res.data?.errorCode == 0) {
                        users.splice(i, 1)
                        userGeoLocation.splice(i, 1)
                    } else {
                        Alert.alert('something went wrong!')
                    }
                }).catch((err) => { console.log(err); Alert.alert('error: connnection error, make sure you are connected to internet') })
            }
        } else {
            console.log(res.data)
        }
    }
    return (
        <View>
            {isLoading && <LoadingAnimation />}
            <Text>welcome, {route.params.name} </Text>
            <View>
                <ScrollView horizontal={true} >
                    {userGeoLocation ?
                        users.map((e, i) => {
                            return (
                                <View key={i} style={{ display: 'flex' }}>
                                    <Image style={{ height: 100, width: 100, flexGrow: 2 }} source={{ uri: 'data:image/png;base64,' + e.buffer }} />
                                    <TouchableOpacity onPress={() => HandleAccept(i)}>
                                        <Image style={{ height: 40, width: 40 }} source={require('../../images/checkmark.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleCancel(i)} >
                                        <Image style={{ height: 40, width: 40 }} source={require('../../images/xmark.png')} />
                                    </TouchableOpacity>
                                    <Text>{userGeoLocation[i]}</Text>
                                </View>
                            )
                        }) : <Text style={{fontSize:30}} >loading.....</Text>}
                </ScrollView>
            </View>
            <Button title='cancelled things' onPress={() => navigation.navigate('CancelledList')} />
            <Button title='proccessing stuff' onPress={() => navigation.navigate('AcceptedList')} />
            <Button title='completed stuff' onPress={() => navigation.navigate('CompletedList')} />
        </View>
    )
}