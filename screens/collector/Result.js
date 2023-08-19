import { Image, Text, TouchableOpacity, View } from "react-native";
import { useFonts } from 'expo-font'
import LoadingAnimation from "../LoadingAnimation";

export default function Report({route}) {
    let [fontsLoaded] = useFonts({
        'bebas': require('../../assets/fonts/BebasNeue-Regular.ttf')
      });
      if (!fontsLoaded) {
        return <LoadingAnimation />;
      }

    return (
        <View style={{backgroundColor:'white',flex:1}}>
            <View style={{borderBottomWidth:1,borderColor:'#5e17eb',padding:5}}>
              <Text style={{fontFamily:'bebas',fontSize:25,padding:20,alignSelf:'center'}}>Thank you for your support!</Text>
            </View>
            <View style={{padding:15}}>
              {route.params.image ?
              <Image source={{uri:'data:img/png;base64,'+route.params.image}} style={{height:250,width:250,alignSelf:'center',borderRadius:15}} />:<></>}
            </View>
            <View style={{padding:20,borderWidth:1,borderRadius:15,borderColor:'#5e17eb',width:350,alignSelf:"center"}}>
              <Text style={{padding:10,fontFamily:'bebas',fontSize:15}}>Collected from: {route.params.location}</Text>
              <Text style={{padding:10,fontFamily:'bebas',fontSize:15}}>Citizen's name: {route.params.username}</Text>
              <Text style={{padding:10,fontFamily:'bebas',fontSize:15}}>Collector's name: {route.params.collectorUsername} </Text>
            </View>

           <View style={{padding:15}}> 
             <TouchableOpacity style={{alignSelf:'center',padding:20,borderWidth:1,borderColor:'#5e17eb',backgroundColor:'#5e17eb',width:'75%',borderRadius:15}}>
                  <Text style={{color:'white',fontFamily:'bebas',alignSelf:'center'}}>Notify scrap dealer</Text>
              </TouchableOpacity>

           </View>

        </View>
    )
}