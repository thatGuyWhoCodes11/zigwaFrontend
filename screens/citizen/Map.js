import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Modal, Button } from 'react-native';
import { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
export default function Citizen({ route, navigation }) {
  [mapModal, setMapModal] = useState(false)
  return (
    <View>
      <View style={{ alignSelf: 'center' }}>
        <Button title='show map' onPress={() => { setMapModal(true) }} />
      </View>
      {mapModal && <Modal onRequestClose={() => setMapModal(false)} >
        <Button title='exit' onPress={() => setMapModal(false)} />
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={{ latitude: 37.7749, longitude: -122.4194 }} title='test point' />
          <Marker coordinate={{ latitude: 37.7749, longitude: -122.5000 }} title='test point' />
          <MapViewDirections apikey='' origin={{ latitude: 37.7749, longitude: -122.4194 }} destination={ { latitude: 37.7749, longitude: -122.5000 }} />
        </MapView>
      </Modal>}
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%'
  }
});