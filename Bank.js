import { Text } from "react-native";

export default function Bank({route}){
    return(
        <Text style={{top:100}} >this is bank! {route.params.test}</Text>
    )
}