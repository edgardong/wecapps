import React from 'react'
import TabRouter from './tab'
import Login from '../pages/Login'
import { createStackNavigator, createAppContainer } from 'react-navigation'

const AppNavigator = createStackNavigator(
  {
    Main: {
      screen: TabRouter,
      navigationOptions: ({ navigation }) => ({
        // title: `${navigation.state.params.name}'s Profile'`
        title: `首页`
      })
    },
    Login: {
      screen: Login,
      navigationOptions: ({ navigation }) => ({
        title: `登陆`
      })
    }
  },
  {
    initialRouteName: 'Login'
  }
)

export default createAppContainer(AppNavigator)
