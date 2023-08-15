import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Modal, Button } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Account from './citizen/Account'
import Home from './citizen/Home'
import CustomDrawerCitizen from './customDrawers/CustomDrawerCitizen';
import Reports from './citizen/Reports';

const drawer=createDrawerNavigator()

export default function CitizenDrawer({route}) {
  return(
    <drawer.Navigator initialRouteName='home' drawerContent={(props)=><CustomDrawerCitizen route={route} {...props} />} >
      <drawer.Screen name='home' component={Home} initialParams={route} options={{ title: "Home", headerTransparent: false }}/>
      <drawer.Screen name='account' component={Account} initialParams={route} options={{ title: "Account", headerTransparent: true }}/>
      <drawer.Screen name='Reports' component={Reports} initialParams={route} options={{title:"Reports",headerTransparent:true}} />
    </drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%'
  }
});