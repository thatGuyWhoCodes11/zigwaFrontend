import { createStackNavigator } from "@react-navigation/stack"
import Home from "./scrapDealer/Home"
const stack=createStackNavigator()
export default function ScrapDealerStack({route}){
    return(
        <stack.Navigator initialRouteName="Home">
            <stack.Screen name='Home' component={Home} initialParams={route.params}  />
        </stack.Navigator>
    )
}