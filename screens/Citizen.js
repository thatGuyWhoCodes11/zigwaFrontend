import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Modal, Button } from 'react-native';
import { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
export default function Citizen({ route, navigation }) {
  [mapModal, setMapModal] = useState(false)
  return (
    <Text>placeholder</Text>
  )
}

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%'
  }
});