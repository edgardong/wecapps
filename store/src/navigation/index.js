import React from 'react'
import MainTabNavigator from './tab'
import Login from '../pages/Login'
import Product from '../pages/Product'
import {
  createSwitchNavigator,
  createAppContainer,
  createStackNavigator
} from 'react-navigation'

const AppNavigator = createStackNavigator({
  Main: MainTabNavigator,
  Product: Product
})

export default createAppContainer(AppNavigator)
