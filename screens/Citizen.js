import { StatusBar } from 'expo-status-bar';
import { StyleSheet,View, Modal, Button } from 'react-native';
import { useState } from 'react';
import MapView from 'react-native-maps';
export default function Citizen({ route, navigation }) {
[mapModal,setMapModal]=useState(false)
  return (
    <View>
      <View style={{alignSelf:'center'}}>
        <Button title='show map' onPress={()=>{setMapModal(true)}}/>
      </View>
      {mapModal && <Modal>
      <MapView
      style={styles.map}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0,
          longitudeDelta: 0,
        }}
      />
      </Modal>}
    </View>
  )
}

const styles = StyleSheet.create({
  map:{
    height:'100%',
    width:'100%'
  }
});