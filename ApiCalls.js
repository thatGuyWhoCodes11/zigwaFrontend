import * as Location from 'expo-location';
import axios from 'axios';
// function to get device location
async function GetLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted')
        throw new Error('need location to function!')
    const location = await Location.getCurrentPositionAsync()
    const t = { latitude: location.coords.latitude, longitude: location.coords.longitude }
    return t
}
// function to search by citizen name to get the list of their transactions
async function TransactionsSearchByCitizen(_, citizenUsername) {
    const res = await axios.get(`https://zigwa.cleverapps.io/transactions?citizenUsername=${citizenUsername}`)
    if(res.data.userData.length==0)
        return []
    else
        return res.data.userData
}
//function to search by an array of image names to get a set of images
async function SearchByImgNameArray(_, data) {
    let temp = data.map(async (e) => {
        const res = await axios.get(`https//zigwa.cleverapps.io/location?image_name=${e.image_name}`)
        return res.data.doc[0].buffer
    })
    return temp
}
//function to search an array of coords to get their geoLocations
async function GetGeoLocationArray(_, data) {

    let temp = data.map(async (e) => {
        const res = await axios.get(`https://api.maptiler.com/geocoding/${e.longitude},${e.latitude}.json?key=EXraYT9hKOgDIdJtEpJn`)
        const { features: [{ place_name }] } = res.data
        return place_name
    })
    return temp
}

export { GetLocation, TransactionsSearchByCitizen, SearchByImgNameArray, GetGeoLocationArray }