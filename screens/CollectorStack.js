import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './collector/Home';
import Reports from './collector/Reports';
import Result from './collector/Result';
import History from './collector/History';
import Accept_details from './collector/Accept_details';
import Notifications from './collector/Notifications';
const stack = createStackNavigator()

export default function CollectorStack({ route }) {
    return (
        <stack.Navigator>
            <stack.Screen name='Home' component={Home} initialParams={route.params.params} options={{ title: " ", headerTransparent: true }} />
            <stack.Screen name='Reports' component={Reports} />
            <stack.Screen name='Result' component={Result} />
            <stack.Screen name='History' component={History} />
            <stack.Screen name='Accept_details' component={Accept_details} />
            <stack.Screen name='Notifications' component={Notifications} />
        </stack.Navigator>
    )
}