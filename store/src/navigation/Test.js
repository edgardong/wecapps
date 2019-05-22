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
  // 设置顶部导航栏的相关样式
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state
    console.log('home.js...', params)
    return {
      title: params ? params.title : '首页',
      headerStyle: {
        backgroundColor: '#fff'
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }
  }

  render() {
    return <Placeholder text="B!" />
  }
}

// const HomeStack = createStackNavigator(
//   { A },
//   {
//     navigationOptions: {
//       tabBarLabel: 'Home!'
//     },
//     defaultNavigationOptions: {
//       title: 'Welcome'
//     }
//   }
// )

// let SettingsStack = createStackNavigator(
//   {
//     B: {
//       screen: B,
//       path: 'b',
//       navigationOptions: ({ navigation }) => ({
//         title: `${navigation.state.params.name}'s Profile'`,
//         tabBarLabel: 'Settings!'
//       })
//     }
//   },
//   {
//     defaultNavigationOptions: {
//       title: 'Settings'
//     }
//   }
// )

// export default createAppContainer(SettingsStack)

export default createAppContainer(
  createBottomTabNavigator({
    A: {
      screen: A,
      navigationOptions: {
        tabBarLabel: 'Home!',
        headerTitle: 'Welcome'
      },
      defaultNavigationOptions: {
        title: 'Welcome'
      }
    },
    B: {
      screen: B,
      navigationOptions: {
        tabBarLabel: 'BBBB!',
        headerTitle: 'web b'
      },
      defaultNavigationOptions: {
        title: 'Welcome BBBB'
      }
    }
  })
)

// export default createAppContainer(SettingsStack)
