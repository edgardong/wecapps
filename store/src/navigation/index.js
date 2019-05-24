import React from 'react'
import MainTabNavigator from './tab'
import Login from '../pages/Login'
import ProductScreen from '../pages/Product'
import Loading from '../pages/Loading'
import {
  createSwitchNavigator,
  createAppContainer,
  createStackNavigator
} from 'react-navigation'

const AppNavigator = createStackNavigator({
  Main: MainTabNavigator,
  Product: ProductScreen
})

const App = createSwitchNavigator({
  AppLoding: Loading,
  Login: Login,
  App: AppNavigator
})

export default createAppContainer(App)
