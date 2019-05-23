import React from 'react'
import { View, Text } from 'react-native'
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation'

const Placeholder = ({ text }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{text}</Text>
  </View>
)

class A extends React.Component {
  render() {
    return <Placeholder text="A!" />
  }
}

class B extends React.Component {
  render() {
    return <Placeholder text="B!" />
  }
}

const HomeStack = createStackNavigator(
  { A },
  {
    navigationOptions: {
      tabBarLabel: 'Home!'
    },
    defaultNavigationOptions: {
      title: 'Welcome'
    }
  }
)

let SettingsStack = createStackNavigator(
  { B },
  {
    navigationOptions: {
      tabBarLabel: 'Settings!'
    },
    defaultNavigationOptions: {
      title: 'Settings'
    }
  }
)

export default createAppContainer(
  createBottomTabNavigator({
    HomeStack,
    SettingsStack
  })
)
