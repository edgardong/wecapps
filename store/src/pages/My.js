import React, {
  Component
} from 'react'

import {Text}  from 'react-native'

export default class My extends Component {
  constructor(props) {
    super(props)
  }

  // 设置顶部导航栏的相关样式
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state

    return {
      tabBarLabel: '我的'
    }
  }

  render() {
    return <Text>我的</Text>
  }
}