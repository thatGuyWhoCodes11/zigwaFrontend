import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Sign_Up from './screens/Sign_Up';
import Sign_In from './screens/Sign_In';

const stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name='Sign up' component={Sign_Up} />
        <stack.Screen name='Sign_In' component={Sign_In} />
      </stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});