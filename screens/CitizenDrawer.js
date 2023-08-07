import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Modal, Button } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './citizen/Home'
import Map from './citizen/Map'
const drawer=createDrawerNavigator()

export default function CitizenDrawer({route}) {
  return(
    <drawer.Navigator initialRouteName='home' >
      <drawer.Screen name='home' component={Home} initialParams={route} />
      <drawer.Screen name='map' component={Map} />
    </drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%'
  }
});