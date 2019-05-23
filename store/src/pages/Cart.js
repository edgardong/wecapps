import React, { Component } from 'react'
import { Text } from 'react-native'
import { withNavigationFocus } from 'react-navigation'

import Storage from '../utils/storage'

export default withNavigationFocus(
  class Cart extends Component {
    constructor(props) {
      super(props)
    }

    async componentDidUpdate() {
      console.log('componentDidUpdate')
      if (this.props.isFocused) {
        let user = await Storage.getItem('user')
        if(!user){
          this.props.navigation.navigate('Login')
        }
      }
    }

    // 设置顶部导航栏的相关样式
    static navigationOptions = ({ navigation }) => {
      const { params } = navigation.state
      console.log('cart....')
      return {
        title: '购物车'
      }
    }

    render() {
      return <Text>购物车</Text>
    }
  }
)
