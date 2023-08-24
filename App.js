import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Sign_Up from './screens/Sign_Up';
import Sign_In from './screens/Sign_In';
import CitizenDrawer from './screens/CitizenDrawer';
import CollectorStack from './screens/CollectorStack';
import ScrapDealerStack from './screens/ScrapDealerStack';
import Bank from './Bank';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const stack = createStackNavigator()
const queryClient = new QueryClient()
export default function App() {
  return (
    <QueryClientProvider client={queryClient} >
      <NavigationContainer>
        <stack.Navigator screenOptions={{ headerShown: false }} >
          <stack.Screen name='Sign_Up' component={Sign_Up} options={{ title: "", headerTransparent: true }} />
          <stack.Screen name='Sign_In' component={Sign_In} options={{ title: "", headerTransparent: true }} />
          <stack.Screen name='CollectorStack' component={CollectorStack} />
          <stack.Screen name='CitizenDrawer' component={CitizenDrawer} />
          <stack.Screen name='ScrapDealerStack' component={ScrapDealerStack} />
          <stack.Screen name='Bank' component={Bank} />
        </stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  title: {
    backgroundColor: 'purple'
  }

});