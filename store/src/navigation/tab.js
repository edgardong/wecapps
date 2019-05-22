import React from 'react'
import HomeScreen from '../pages/Home'
// import Product from '../pages/Product'
import CategoryScreen from '../pages/Category'
import CartScreen from '../pages/Cart'
import MyScreen from '../pages/My'

import {
  createBottomTabNavigator,
  createStackNavigator
} from 'react-navigation'
import { Image } from 'react-native'

// 首页导航
let HomeStack = createStackNavigator({
  Home: HomeScreen
})

HomeStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: '首页',
  title: '首页',
  tabBarIcon: ({ focused, horizontal, tintColor }) => {
    return (
      <Image
        source={
          focused
            ? require('../images/toolbar/homeselected.png')
            : require(`../images/toolbar/home.png`)
        }
        style={{ width: 30, height: 30 }}
      />
    )
  }
})

// 分类导航
let CategoryStack = createStackNavigator({
  Category: CategoryScreen
})

CategoryStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: '分类',
  title: '分类',
  tabBarIcon: ({ focused, horizontal, tintColor }) => {
    return (
      <Image
        source={
          focused
            ? require('../images/toolbar/categoryselected.png')
            : require(`../images/toolbar/category.png`)
        }
        style={{ width: 30, height: 30 }}
      />
    )
  }
})

// 购物车
let CartStack = createStackNavigator({
  Cart: CartScreen
})

CartStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: '购物车',
  title: '购物车',
  tabBarIcon: ({ focused, horizontal, tintColor }) => {
    return (
      <Image
        source={
          focused
            ? require('../images/toolbar/cartselected.png')
            : require(`../images/toolbar/cart.png`)
        }
        style={{ width: 30, height: 30 }}
      />
    )
  }
})

// 我的
let MyStack = createStackNavigator({
  My: MyScreen
})
MyStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: '我的',
  title: '我的',
  tabBarIcon: ({ focused, horizontal, tintColor }) => {
    return (
      <Image
        source={
          focused
            ? require('../images/toolbar/myselected.png')
            : require(`../images/toolbar/my.png`)
        }
        style={{ width: 30, height: 30 }}
      />
    )
  }
})

let RootTabs = createBottomTabNavigator(
  {
    HomeStack,
    CategoryStack,
    CartStack,
    MyStack
  },
  {
    initialRouteName: 'HomeStack',
    tabBarOptions: {
      activeTintColor: 'rgb(171, 149, 109)',
      inactiveTintColor: '#989898'
    }
  }
)

export default RootTabs
