import React from 'react'
import MainTabNavigator from './tab'
import Login from '../pages/Login'
import ProductScreen from '../pages/Product'
import ThemeScreen from '../pages/Theme'
import OrderScreen from '../pages/Order'
import PayResultScreen from '../pages/PayResult'
import Loading from '../pages/Loading'
import AddressScreen from '../pages/Address'

import {
  createSwitchNavigator,
  createAppContainer,
  createStackNavigator
} from 'react-navigation'

const AppNavigator = createStackNavigator({
  Main: MainTabNavigator,
  Product: ProductScreen,
  Theme: ThemeScreen,
  Order: OrderScreen,
  PayResult: PayResultScreen,
  Address: AddressScreen
})

// AppNavigator.navigationOptions = ({
//   navigation
// }) => {
//   let tabBarVisible = true
//   if (navigation.state.index > 0) {
//     tabBarVisible = false
//   }

//   return {
//     tabBarVisible
//   }
// }

const LoginStack = createStackNavigator({
  Login: Login
})

// LoginStack.navigationOptions = ({
//   navigation
// }) => {
//   return {
//     title: '登录'
//   }
// }

const App = createSwitchNavigator({
  AppLoding: Loading,
  Login: LoginStack,
  App: AppNavigator
})

export default createAppContainer(App)