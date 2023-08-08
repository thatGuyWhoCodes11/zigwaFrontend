import React from 'react'
import { View, Text,TouchableOpacity } from 'react-native'
export default function Account({ route }) {
    console.log(route.params.params.params)
    return (
        <View style={{ display:'flex', backgroundColor:'#7aabfa' }}>
            <TouchableOpacity style={{padding:5,flexDirection:'row',display:'flex', justifyContent:'space-between'}}>
                <Text>change username</Text>
                <Text>{route.params.params.params.username}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding:5,flexDirection:'row',justifyContent:'space-between'}}>
                <Text>change password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding:5,flexDirection:'row',justifyContent:'space-between'}}>
                <Text>change profile picture</Text>
                <Text>username</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding:5,flexDirection:'row',justifyContent:'space-between'}}>
                <Text>change name</Text>
                <Text>{route.params.params.params.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>Report</Text>
            </TouchableOpacity>
        </View>
    )
}