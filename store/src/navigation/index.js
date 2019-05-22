import React from 'react'
import MainTabNavigator from './tab'
import Login from '../pages/Login'
import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation'

const AppNavigator = createSwitchNavigator({
  Main: MainTabNavigator
})

export default createAppContainer(AppNavigator)
