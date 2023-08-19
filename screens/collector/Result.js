import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Result({route}) {
    async function handleButton(){
        console.log(route.params)
    }
    return (
        <View>
            <Text>thank you for your support!</Text>
            <Text>collected from: {route.params.location}</Text>
            <Text>citizen's name: {route.params.username}</Text>
            <Text>collector's name: {route.params.collectorUsername} </Text>{route.params.image ?
            <Image source={{uri:'data:img/png;base64,'+route.params.image}} style={{height:100,width:100}} />:<></>}
            <TouchableOpacity onPress={handleButton}>
                <Text>notify scrap dealer</Text>
            </TouchableOpacity>
        </View>
    )
}