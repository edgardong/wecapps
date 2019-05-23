import React from 'react'
import MainTabNavigator from './tab'
import Login from '../pages/Login'
import Product from '../pages/Product'
import Loading from '../pages/Loading'
import {
  createSwitchNavigator,
  createAppContainer,
  createStackNavigator
} from 'react-navigation'

const AppNavigator = createStackNavigator({
  Main: MainTabNavigator,
  Product: Product
})

const App = createSwitchNavigator({
  AppLoding:Loading,
  App: AppNavigator,
  Login: Login
})

export default createAppContainer(App)