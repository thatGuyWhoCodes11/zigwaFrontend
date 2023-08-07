import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Image} from 'react-native';
export default function Home({route}) {
  return (
    <View>
        <Text>Welcome,{route.params.params.params.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({

});