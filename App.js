import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Sign_Up from './screens/Sign_Up';
import Sign_In from './screens/Sign_In';
import CitizenDrawer from './screens/CitizenDrawer';
const stack = createStackNavigator()
const drawer = createDrawerNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <stack.Navigator screenOptions={{headerShown:false}} >
        <stack.Screen name='Sign_Up' component={Sign_Up} options={{ title: "", headerTransparent: true }} />
        <stack.Screen name='Sign_In' component={Sign_In} options={{ title: "", headerTransparent: true }} />
        <stack.Screen name='CitizenDrawer' component={CitizenDrawer}  />
      </stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    backgroundColor: 'purple'
  }

});