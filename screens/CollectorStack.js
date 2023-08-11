import * as React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './collector/Home'
import Reports from './collector/Reports';

const stack =createStackNavigator()

export default function CollectorStack({route}){
    return (
            <stack.Navigator>
                <stack.Screen name='Home' component={Home} initialParams={route.params.params}  />
                <stack.Screen name='Reports' component={Reports} />
            </stack.Navigator>
    )
}