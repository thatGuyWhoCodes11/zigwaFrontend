import React from "react"
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer"
import { View, Text, Image } from "react-native"

export default function CustomDrawerCitizen({route,...props}) {
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} >
                <View>
                    <Image source={require('../../images/thumb_15951118880user.webp')} style={{borderRadius:100, height:80, width:80} } />
                    <Text style={{fontSize:20}}>{route.params.params.name}</Text>
                    <Text style={{fontSize:20}}>credits: 100</Text>
                </View>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
    )
}