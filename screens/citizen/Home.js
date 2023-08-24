import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'
import { useFonts } from 'expo-font'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios';
import LoadingAnimation from '../LoadingAnimation';
import { useQuery } from '@tanstack/react-query';
import { GetLocation } from '../../ApiCalls'

export default function Citizen({ route, navigation }) {
  const [userImage, setUserImage] = useState('')
  const [imageModal, setImageModal] = useState(false)
  const [geoLocation, setGeoLocation] = useState('')
  const { isError, isLoading, data } = useQuery({
    queryKey: ['location'],
    queryFn: GetLocation,
    staleTime: 10000
  })
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
    axios.get(`https://api.maptiler.com/geocoding/${data.longitude},${data.latitude}.json?key=EXraYT9hKOgDIdJtEpJn`).then((res) => {
      const { features: [{ place_name }] } = res.data
      setGeoLocation(place_name)
    }).catch((err) => { console.log(err); setImageModal(false) })
  }
  function sendImage() {
    formData = new FormData()
    formData.append('image', userImage.base64)
    formData.append('location', JSON.stringify(data))
    axios.post('https://zigwa.cleverapps.io/location', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
      if (res.data.errorCode == 0) {
        setImageModal(false)
        alert('success!, you can see the sent image in reports')
      } else {
        alert('error, something went wrong')
        console.log(res.data)
      }
    }).catch(err => { console.log(err); alert('internal error'); setImageModal(false) })
  }
  //end of handling camera and beginning to handle components
  let [fontsLoaded] = useFonts({
    'bebas': require('../../assets/fonts/BebasNeue-Regular.ttf')
  });
  console.log(isLoading)
  return (
    <>{(isLoading || !fontsLoaded) ? <LoadingAnimation /> :
      <View style={styles.all}>
        <>{!isError ?
          <MapView
            style={styles.map}
            initialRegion={{
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
              latitude: (data.latitude),
              longitude: (data.longitude)
            }
            }
            showsUserLocation={true}
            followsUserLocation={true}
          >
          </MapView> : <Text>Location been denied</Text>}
        </>
        <View>
          <View>
            <TouchableOpacity style={{ alignSelf: 'center', elevation: 20 }} onPress={handleImage}>
              <Image style={styles.cam} source={require('../../images/3178179.png')} />
            </TouchableOpacity>
          </View>
          <View style={styles.mapdownbar}>
            <Text style={{ color: 'white', fontFamily: 'bebas', alignSelf: 'center', padding: 20, fontSize: 18, bottom: 80 }}>Found trash? Take a Snap!</Text>
            <View style={{ bottom: 80 }}>
              {/* <TouchableOpacity style={{ alignSelf: 'center', backgroundColor: 'white', borderRadius: 20, padding: 15 }} onPress={loadLocation}>
                <Text style={{ fontFamily: 'bebas' }}>Get location</Text>
              </TouchableOpacity> */}
            </View>
          </View>
          {imageModal &&
            <Modal>
              <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#5e17eb' }}>
                <Text style={{ fontSize: 25, fontFamily: 'bebas' }}>Here's your snap!</Text>
              </View>
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 20, fontFamily: 'bebas' }}>The Image: </Text>
              </View>
              <View style={{}}>
                <Image source={userImage} style={{ height: 300, width: 300, right: 0, margin: 30, borderRadius: 15, bottom: 10, alignSelf: 'center' }} />
              </View>
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 20, fontFamily: 'bebas' }} >Location: {geoLocation}</Text>
              </View>
              <TouchableOpacity onPress={sendImage} style={{ backgroundColor: '#5e17eb', margin: 20, padding: 10, borderRadius: 15 }}>
                <Text style={{ color: 'white', fontFamily: 'bebas', alignSelf: 'center', fontSize: 15 }}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#5e17eb', margin: 20, padding: 10, borderRadius: 15 }} onPress={() => { setImageModal(false) }}>
                <Text style={{ color: 'white', fontFamily: 'bebas', alignSelf: 'center', fontSize: 15 }}>Cancel</Text>
              </TouchableOpacity>

            </Modal>}
        </View>
      </View>}
    </>
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