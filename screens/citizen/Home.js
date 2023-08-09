import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Modal, Button, Text, Touchable, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'
import { useFonts } from 'expo-font'
import AppLoading from "expo-app-loading";

export default function Citizen({ route, navigation }) {
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Please accept location permissions');
        } else {
          const location = await Location.getCurrentPositionAsync({});
          console.log(location);
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
  }, []);
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
  function handleCamera(){

  }

  let [fontsLoaded] = useFonts({
    'bebas': require('../../assets/fonts/BebasNeue-Regular.ttf')
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.all}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          latitude: location?.longitude || 0,
          longitude: location?.latitude || 0
        }
        }
      >
        <Marker coordinate={{ longitude: (location?.longitude || 0), latitude: (location?.latitude) || 0 }} title='desired location' />
      </MapView>
      <View>
        <View style={{height:1,width:1}}>
          <Image style={styles.nav} source={require('../../images/navbar.png')} />
        </View>
     
        <View>
            <TouchableOpacity style={{alignSelf:'center',elevation:20}}onPress={handleCamera}>
              <Image style={styles.cam} source={require('../../images/3178179.png')} />
            </TouchableOpacity>
          </View>
        <View style={styles.mapdownbar}>
          <Text style={{color:'white',fontFamily:'bebas', alignSelf:'center',padding:20,fontSize:18,bottom:80}}>Found trash? Take a Snap!</Text>
        <View style={{bottom:80}}>
          <TouchableOpacity style={{ alignSelf: 'center',backgroundColor:'white',borderRadius:20,padding:15}} onPress={loadLocation}>
            <Text style={{fontFamily:'bebas'}}>Get location</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    height:'100%',

  },

  cam: {
    height:150,
    width:150,
    top:-70
  },

  nav: {
    height:220,
    width:200,
    top:-580,
    left: -25
   }
});