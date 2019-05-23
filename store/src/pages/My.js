import React, { Component } from 'react'
import { withNavigationFocus } from 'react-navigation'
import { Text } from 'react-native'
import Storage from '../utils/storage'

export default withNavigationFocus(
  class My extends Component {
    constructor(props) {
      super(props)
    }

    async componentDidUpdate() {
      console.log('componentDidUpdate')
      if (this.props.isFocused) {
        let user = await Storage.getItem('user')
        if (!user) {
          this.props.navigation.navigate('Login')
        }
      }
    }

    // 设置顶部导航栏的相关样式
    static navigationOptions = ({ navigation }) => {
      const { params } = navigation.state
      console.log('...xxxx....', navigation)
      return {
        title: '我的',
        headerTitle: '我的'
      }
    }

    render() {
      return <Text>我的</Text>
    }
  }
)
