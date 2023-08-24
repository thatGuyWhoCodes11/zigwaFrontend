import { Alert, Image, Text, TextInput, TouchableOpacity, View,ScrollView } from "react-native";
import { useFonts } from 'expo-font'
import LoadingAnimation from "../LoadingAnimation";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Result({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(true)
  const [image, setImage] = useState()
  const [description, setDescription] = useState()
  useEffect(() => {
    (async () => {
      res = await axios.get(`https://zigwa.cleverapps.io/location?image_name=${route.params.image_name}`);
      if (res.data.errorCode == 0)
        if (res.data.doc.length != 0)
          setImage(res.data.doc[0].buffer)
      setIsLoading(false)
    })()
  }, [])
  let [fontsLoaded] = useFonts({
    'bebas': require('../../assets/fonts/BebasNeue-Regular.ttf')
  });
  async function handleButton() {
    setIsLoading(true)
    const formData = new FormData
    formData.append('citizenUsername', route.params.username)
    formData.append('collectorUsername', route.params.collectorUsername)
    formData.append('image_name', route.params.image_name)
    formData.append('description', description)
    console.log(formData)
    try {
      res = await axios.post('https://zigwa.cleverapps.io/notifications', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (res.data.errorCode == 0) {
        setIsLoading(false)
        Alert.alert('success!')
        navigation.navigate('Home')
      } else {
        setIsLoading(false)
        Alert.alert('something went wrong!')
      }
    } catch (e) {
      setIsLoading(false)
      Alert.alert('something went wrong!')
      console.log(e)
    }
  }
  return (
    <>
      {isLoading ?
        <LoadingAnimation /> : <View style={{ backgroundColor: 'white', flex: 1 }}>
          <ScrollView>
            <View style={{ borderBottomWidth: 1, borderColor: '#5e17eb', padding: 5 }}>
              <Text style={{ fontFamily: 'bebas', fontSize: 25, padding: 20, alignSelf: 'center' }}>Thank you for your support!</Text>
            </View>
            <View style={{ padding: 15 }}>
              <Image source={{ uri: 'data:img/png;base64,' + image }} style={{ height: 250, width: 250, alignSelf: 'center', borderRadius: 15 }} />
            </View>
            <View style={{ padding: 20, borderWidth: 1, borderRadius: 15, borderColor: '#5e17eb', width: 350, alignSelf: "center" }}>
              <Text style={{ padding: 10, fontFamily: 'bebas', fontSize: 15 }}>Collected from: {route.params.location}</Text>
              <Text style={{ padding: 10, fontFamily: 'bebas', fontSize: 15 }}>Citizen's name: {route.params.username}</Text>
              <Text style={{ padding: 10, fontFamily: 'bebas', fontSize: 15 }}>Collector's name: {route.params.collectorUsername} </Text>
            </View>
            <TextInput placeholder='enter your opinion' numberOfLines={5} multiline={true} style={{ borderWidth: 4, textAlignVertical: 'top' }} onChangeText={(text) => setDescription(text)} />
            <View style={{ padding: 15 }}>
              <TouchableOpacity onPress={handleButton} style={{ alignSelf: 'center', padding: 20, borderWidth: 1, borderColor: '#5e17eb', backgroundColor: '#5e17eb', width: '75%', borderRadius: 15 }}>
                <Text style={{ color: 'white', fontFamily: 'bebas', alignSelf: 'center' }}>Notify scrap dealer</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>

        </View>}
    </>
  )
}