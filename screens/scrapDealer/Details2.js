import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { View, Text } from "react-native"
import LoadingAnimation from "../LoadingAnimation"

export default function Details2({ route }) {
    async function getQuery() {
        const res = await axios.get(`https://zigwa.cleverapps.io/location?image_name=${route.params.image_name}`)
        console.log('hi')
        const res2 = await axios.get(`https://api.maptiler.com/geocoding/${res.data.doc[0].location.longitude},${res.data.doc[0].location.latitude}.json?key=EXraYT9hKOgDIdJtEpJn`)
        const { features: [{ place_name }] } = res2.data
        return place_name
    }
    const {isLoading,data}=useQuery({ queryKey: ['GeoLocationer'], queryFn: getQuery, staleTime:10000})
    if(isLoading)
        return <LoadingAnimation/>
    return (
        <View>
            <Text>citizen name: {route.params.citizenUsername} </Text>
            <Text>collector name: {route.params.collectorUsername}</Text>
            <Text>location: {data}</Text>
        </View>
    )
}