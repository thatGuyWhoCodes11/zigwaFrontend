import { createStackNavigator } from "@react-navigation/stack"
import Details from "./scrapDealer/Details"
import Home from "./scrapDealer/Home"
import Received from "./scrapDealer/Received"
const stack=createStackNavigator()
export default function ScrapDealerStack({route}){
    return(
        <stack.Navigator initialRouteName="Home">
            <stack.Screen name='Home' component={Home} initialParams={route.params}  />
            <stack.Screen name='Details' component={Details} />
            <stack.Screen name='Received' component={Received} />
        </stack.Navigator>
    )
}