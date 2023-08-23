import React from "react"
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer"
import { View, Text, Image, StyleSheet} from "react-native"
import { useFonts } from 'expo-font'
import LoadingAnimation from "../LoadingAnimation";

export default function CustomDrawerCitizen({route,...props}) {

    let [fontsLoaded] = useFonts({
        'bebas': require('../../assets/fonts/BebasNeue-Regular.ttf')
      });

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} >
                <View style={styles.prof}>
                  <Image source={require('../../images/proff.png')} style={{borderRadius:100, height:200, width:100} } />
                </View>
                <View style={styles.texts}>
                    
                    <Text style={{fontFamily:'bebas',fontSize:20}}>{route.params.params.name}</Text>
                    <Text style={{fontFamily:'bebas',fontSize:20}}>credits: {route.params.params.credits}</Text>
                </View>
                <View style={{bottom:80}}>
                  <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    prof:{
        bottom:30
    },

    texts: {
        padding:15,
        bottom:80
    }
  });