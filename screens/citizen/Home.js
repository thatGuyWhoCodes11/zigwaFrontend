import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'
import { useFonts } from 'expo-font'
import AppLoading from "expo-app-loading";
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios';

export default function Citizen({ route, navigation }) {
  //handle location from user
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Please accept location permissions');
        } else {
          const location = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    getLocation();
  }, [loadLocation]);
  const [location, setLocation] = useState(null)
  const mapRef = useRef()
  function loadLocation() {
    mapRef.current.animateToRegion({
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02
    })
  }
  //end of handling location and beginning of handling camera
  const [userImage, setUserImage] = useState('')
  const [imageModal, setImageModal] = useState(false)
  const [geoLocation, setGeoLocation] = useState('')
  function handleImage() {
    (async () => {
      let permissions = await ImagePicker.requestCameraPermissionsAsync()
      if (!permissions.granted) {
        alert('camera perms needed')
        return;
      }
      let options = {
        exif: false,
        base64: true
      }
      const image = await ImagePicker.launchCameraAsync(options)
      if (!Array.isArray(image.assets)) {
        alert('no images has been selected')
        return;
      }
      getGeoLocation()
      setUserImage(image.assets.pop())
      setImageModal(true)
    }
    )()
  }
  function getGeoLocation() {
    axios.get(`https://api.maptiler.com/geocoding/${location.longitude},${location.latitude}.json?key=EXraYT9hKOgDIdJtEpJn`).then((res) => {
      const { features: [{ place_name }] } = res.data
      setGeoLocation(place_name)
    }).catch((err) => { console.log(err); setImageModal(false) })
  }
  function sendImage(){
    formData=new FormData()
    formData.append('image',userImage.base64)
    formData.append('location',JSON.stringify(location))
    console.log(formData)
    axios.post('https://zigwa.cleverapps.io/location', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res)=>{
      if(res.data.errorCode==0){
        setImageModal(false)
        alert('success!, you can see the sent image in reports')
      }else{
        alert('error, something went wrong')
        console.log(res.data)
      }
    }).catch(err=>{console.log(err);alert('internal error');setImageModal(false)})
  }
  //end of handling camera and beginning to handle components
  let [fontsLoaded] = useFonts({
    'bebas': require('../../assets/fonts/BebasNeue-Regular.ttf')
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <View style={styles.all}>
      {location ? <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          latitude: location?.longitude || 0,
          longitude: location?.latitude || 0
        }
        }
        showsUserLocation={true}
        followsUserLocation={true}
      >
        <Marker coordinate={{ longitude: (location?.longitude || 0), latitude: (location?.latitude) || 0 }} title='desired location' />
      </MapView> : <AppLoading />}
      <View>
        <View style={{ height: 1, width: 1 }}>
          <Image style={styles.nav} source={require('../../images/navbar.png')} />
        </View>
        <View>
          <TouchableOpacity style={{ alignSelf: 'center', elevation: 20 }} onPress={handleImage}>
            <Image style={styles.cam} source={require('../../images/3178179.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.mapdownbar}>
          <Text style={{ color: 'white', fontFamily: 'bebas', alignSelf: 'center', padding: 20, fontSize: 18, bottom: 80 }}>Found trash? Take a Snap!</Text>
          <View style={{ bottom: 80 }}>
            <TouchableOpacity style={{ alignSelf: 'center', backgroundColor: 'white', borderRadius: 20, padding: 15 }} onPress={loadLocation}>
              <Text style={{ fontFamily: 'bebas' }}>Get location</Text>
            </TouchableOpacity>
          </View>
        </View>
        {imageModal &&
          <Modal>
            <View style={{}}>
              <Text style={{ fontSize: 30 }}>the selected image: </Text>
            </View>
            <View style={{}}>
              <Image source={userImage} style={{ height: 150, width: 150, right: 0, margin: 30 }} />
            </View>
            <View style={{}}>
              <Text style={{ fontSize: 30 }} >your location: {geoLocation}</Text>
            </View>
            <TouchableOpacity style={{backgroundColor:'blue',margin:10}} onPress={() => { setImageModal(false) }}>
              <Text>cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={sendImage} style={{backgroundColor:'blue',margin:10}}>
              <Text>send</Text>
            </TouchableOpacity>
          </Modal>}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  map: {
    height: '65%',
    width: '100%'
  },

  mapdownbar: {
    backgroundColor: "#5e17eb",
    borderRadius: 15
  },

  all: {
    backgroundColor: "#5e17eb",
    height: '100%',

  },

  cam: {
    height: 150,
    width: 150,
    top: -70
  },

  nav: {
    height: 220,
    width: 200,
    top: -580,
    left: -25
  }
});