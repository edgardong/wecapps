import Home from '../pages/Home'
import Product from '../pages/Product'
import Category from '../pages/Category'

import { createStackNavigator, createAppContainer } from 'react-navigation'

const AppNavigator = createStackNavigator({
  Home: {
    screen: Home
  },
  Category:{
    screen:Category
  },
  Product: {
    screen: Product
  },
  initialRouteName: Home
})

export default createAppContainer(AppNavigator)
