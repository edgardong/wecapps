import React, { Component } from 'react'
import { Text } from 'react-native'
import { withNavigation, withNavigationFocus } from 'react-navigation'

import Storage from '../utils/storage'

export default withNavigationFocus(
  class Cart extends Component {
    constructor(props) {
      super(props)
    }

    async componentDidUpdate() {
      console.log('componentDidUpdate', this.props)
      if (this.props.isFocused) {
        console.log('props....')
        let user = await Storage.getItem('token')
        console.log(user)
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
