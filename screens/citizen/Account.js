import React from 'react'
import { View, Text,TouchableOpacity } from 'react-native'
import { useFonts } from 'expo-font'

import LoadingAnimation from '../LoadingAnimation';
export default function Account({ route }) {
    let [fontsLoaded] = useFonts({
        'bebas': require('../../assets/fonts/BebasNeue-Regular.ttf')
      });

    return (
        <View style={{ top:100,display:'flex',padding:15 }}>
            <View style={{paddingBottom:10}}> 
              <View style={{padding:10,borderColor:'#5e17eb',borderWidth:1,borderRadius:15}}>
                <TouchableOpacity style={{padding:5,flexDirection:'row',display:'flex', justifyContent:'space-between'}}>
                    <Text style={{fontFamily:'bebas'}}>Change username</Text>
                    <Text style={{fontFamily:'bebas'}}>{route.params.params.params.username}</Text>
                </TouchableOpacity>
            </View>

            </View>

            <View style={{paddingBottom:10}}>

              <View style={{padding:10,borderColor:'#5e17eb',borderWidth:1,borderRadius:15}}>
                <TouchableOpacity style={{padding:5,flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{fontFamily:'bebas'}}>Change password</Text>
                </TouchableOpacity>
               </View>

            </View>

            <View style={{paddingBottom:10}}>

              <View style={{padding:10,borderColor:'#5e17eb',borderWidth:1,borderRadius:15}}>
                <TouchableOpacity style={{padding:5,flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{fontFamily:'bebas'}}>Change profile picture</Text>
                </TouchableOpacity>
              </View>

            </View>

            <View style={{paddingBottom:10}}>
              <View style={{padding:10,borderColor:'#5e17eb',borderWidth:1,borderRadius:15}}>  
                <TouchableOpacity style={{padding:5,flexDirection:'row',justifyContent:'space-between'}}>
                    <Text style={{fontFamily:'bebas'}}>Change name</Text>
                    <Text style={{fontFamily:'bebas'}}>{route.params.params.params.name}</Text>
                </TouchableOpacity>
              </View>

            </View>


            <View style={{padding:10,borderColor:'#5e17eb',borderWidth:1,borderRadius:15,backgroundColor:'#5e17eb'}}>
              <TouchableOpacity>
              <Text style={{color:'white',fontFamily:'bebas'}}>Report</Text>
            </TouchableOpacity>

            </View>

        </View>
    )
}