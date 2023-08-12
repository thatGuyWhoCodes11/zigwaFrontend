import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Image, ScrollView, Text, View, TouchableOpacity } from 'react-native';

export default function Home({ route,navigation }) {
    const [users, setUsers] = useState(null)
    const [userGeoLocation, setUserGeoLocation] = useState([])
    const [coords,setCoords]=useState([])
    useEffect(() => {
        try {
            (async () => {
                const res = await axios.get('https://zigwa.cleverapps.io/location')
                if (res.data.errorCode == 0) {
                    setUsers(res.data.doc)
                    let location = []
                    res.data.doc.forEach((e) => {
                        location.push(JSON.parse(e.location))
                    })
                    setCoords(location)
                    location.forEach(async (e) => {
                        const res2 = await axios.get(`https://api.maptiler.com/geocoding/${e.longitude},${e.latitude}.json?key=EXraYT9hKOgDIdJtEpJn`)
                        const { features: [{ place_name }] } = res2.data
                        setUserGeoLocation(prev=>[...prev,place_name])
                    })
                }
                else
                    alert('failed connecting to server')
            })()
        } catch (err) { alert(JSON.stringify(err)) }
        return;
    }, [])
    function HandleAccept(i){
        navigation.navigate('Reports',coords[i])
    }
    return (
        <View>
            <Text>welcome, {route.params.name} </Text>
            <View>
                <ScrollView horizontal={true} >
                    {users && userGeoLocation ? users.map((e,i) => {
                        return (
                            <View key={i} style={{ display: 'flex' }}>
                                <Image style={{ height: 100, width: 100, flexGrow: 2 }} source={{ uri: 'data:image/png;base64,' + e.buffer }} />
                                <TouchableOpacity onPress={()=>HandleAccept(i)}>
                                    <Image style={{ height: 40, width: 40 }} source={require('../../images/checkmark.png')} />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image style={{ height: 40, width: 40 }} source={require('../../images/xmark.png')} />
                                </TouchableOpacity>
                                <Text>{userGeoLocation[i]}</Text>
                            </View>
                        )
                    }) : <Text>loading.....</Text>}
                </ScrollView>
            </View>
        </View>
    )
}