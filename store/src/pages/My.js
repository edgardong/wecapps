import React, { Component } from 'react'
import { withNavigationFocus, SwitchActions } from 'react-navigation'
import { Text, Button, View } from 'react-native'
import Storage from '../utils/storage'

export default withNavigationFocus(
  class My extends Component {
    constructor(props) {
      super(props)
    }

    async componentDidUpdate() {
      console.log('componentDidUpdate')
      if (this.props.isFocused) {
        let user = await Storage.getItem('token')
        if (!user) {
          this.props.navigation.navigate('Login')
        }
      }
    }

    // 设置顶部导航栏的相关样式
    static navigationOptions = ({ navigation }) => {
      const { params } = navigation.state
      return {
        title: '我的',
        headerTitle: '我的'
      }
    }

    handleClearCache() {
      let _this = this
      Storage.removeItem('token')
        .then(resp => {
          console.log(resp)
          console.log('删除掉了')
          console.log(_this.props.navigation)
          _this.props.navigation.navigate('Home')
          // _this.props.navigation.dispatch(
          //   SwitchActions.jumpTo({
          //     routeName: 'App'
          //   })
          // )
        })
        .catch(err => {
          console.log('err', err)
        })
    }

    render() {
      return (
        <View>
          <Text>我的</Text>
          <View>
            <Button
              title={'清除缓存'}
              onPress={() => this.handleClearCache()}
            />
          </View>
        </View>
      )
    }
  }
)
