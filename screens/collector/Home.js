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
                const res = await axios.get('https://zigwa.cleverapps.io/location')
                if (res.data.errorCode == 0) {
                    let location = []
                    setCitizens(res.data.doc)
                    res.data.doc.forEach(async (e) => {
                        const res = await axios.get(`https://zigwa.cleverapps.io/transactions?citizenUsername=${e.username}`)
                        const resIgnore = await axios.get(`https://zigwa.cleverapps.io/ignore?collectorUsername=${route.params.username}&imageName=${e.image_name}`)
                        const res2 = await axios.get(`https://api.maptiler.com/geocoding/${e.location.longitude},${e.location.latitude}.json?key=EXraYT9hKOgDIdJtEpJn`)
                        if (res.data.userData.length != 0) {
                            console.log('print!')
                            res.data.userData.forEach((e2) => {
                                if ((e2.citizenLocation.latitude !== e.location.latitude) && (resIgnore.data.errorCode != 0)) {//to check whether the image exists in transactions or not
                                    location.push(e.location);
                                    setUsers(prev => [...prev, e])
                                    const { features: [{ place_name }] } = res2.data
                                    setUserGeoLocation(prev => [...prev, place_name])
                                    setCoords(location)
                                }
                            })
                        } else {
                            if ((resIgnore.data.errorCode != 0)) {//to check whether the image exists in transactions or not
                                location.push(e.location);
                                setUsers(prev => [...prev, e])
                                const { features: [{ place_name }] } = res2.data
                                setUserGeoLocation(prev => [...prev, place_name])
                                setCoords(location)
                            }
                        }
                    })
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
    async function handleCancel(index) {
        const formData = new FormData
        formData.append('imageName', citizens[index].image_name)
        formData.append('collectorUsername', route.params.username)
        const res = await axios.post('https://zigwa.cleverapps.io/ignore', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        console.log(res.data)
        if (res.data.errorCode == 0) {
            const updatedU = users.filter((_, i) => i !== index)
            const updatedG = userGeoLocation.filter((_, i) => i !== index)
            setUsers(updatedU)
            setUserGeoLocation(updatedG)
        } else {
            Alert.alert('something went wrong!, please make sure you\'re connected to the internet!')
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
                        }) : <Text style={{ fontSize: 30 }} >loading....</Text>}
                </ScrollView>
            </View>
            <Button title='history' onPress={() => navigation.navigate('History')} />
        </View>
    )
}