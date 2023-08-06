import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Image} from 'react-native';

export default function Citizen({navigation,route}) {
    console.log(route.params)
  return (
    <View>
        <Text>hi citizen, </Text>
    </View>
  );
}

const styles = StyleSheet.create({

});