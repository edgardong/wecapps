import React, {
  Component
} from 'react'
import {Text} from 'react-native'
export default class Cart extends Component {
  constructor(props) {
    super(props)
  }

  // 设置顶部导航栏的相关样式
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state

    return {
      title: '购物车',
      // title: params ? params.title : '首页',
      // headerStyle: {
      //   backgroundColor: '#fff'
      // },
      // headerTintColor: 'black',
      // headerTitleStyle: {
      //   fontWeight: 'bold'
      // }
    }
  }

  render() {
    return <Text>购物车</Text>
  }
}