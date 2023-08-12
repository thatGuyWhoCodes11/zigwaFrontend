import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Report({route}) {
    return (
        <View>
            <Text>thank you for your support!</Text>
            <Text>collected from: {route.params.location}</Text>
            <Text>citizen name: {route.params.name}</Text>
            <Text>citizen's name: {route.params.username}</Text>
            <Text>collector's name: {route.params.collectorUsername} </Text>
            <Image source={{uri:'data:img/png;base64,'+route.params.image}} style={{height:100,width:100}} />
            <TouchableOpacity>
                <Text>notify scrap dealer</Text>
            </TouchableOpacity>
        </View>
    )
}