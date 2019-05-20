import Home from '../pages/Home'
import Product from '../pages/Product'

import { createStackNavigator, createAppContainer } from 'react-navigation'

const AppNavigator = createStackNavigator({
  Home: {
    screen: Home
  },
  Product: {
    screen: Product
  },
  initialRouteName: Home
})

export default createAppContainer(AppNavigator)
