import React from 'react'
import MainTabNavigator from './tab'
import Login from '../pages/Login'
import ProductScreen from '../pages/Product'
import ThemeScreen from '../pages/Theme'
import OrderScreen from '../pages/Order'
import Loading from '../pages/Loading'
import {
  createSwitchNavigator,
  createAppContainer,
  createStackNavigator
} from 'react-navigation'

const AppNavigator = createStackNavigator({
  Main: MainTabNavigator,
  Product: ProductScreen,
  Theme: ThemeScreen,
  Order: OrderScreen
})

AppNavigator.navigationOptions = ({
  navigation
}) => {
  let tabBarVisible = true
  if (navigation.state.index > 0) {
    tabBarVisible = false
  }

  return {
    tabBarVisible
  }
}

const App = createSwitchNavigator({
  AppLoding: Loading,
  Login: Login,
  App: AppNavigator
})

export default createAppContainer(App)