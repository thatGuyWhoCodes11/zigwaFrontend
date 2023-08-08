import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Modal, Button, Text, Touchable, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'
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
  return (
    <View>
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
        <TouchableOpacity style={{alignSelf:'center'}} onPress={handleCamera}>
          <Image style={{ height: 60, width: 60}} source={require('../../images/3178179.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={{ alignSelf: 'center',backgroundColor:'#4eeff5',borderRadius:20,padding:10 }} onPress={loadLocation}>
          <Text>get location</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    height: '80%',
    width: '100%'
  }
});