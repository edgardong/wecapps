import React, { Component } from 'react'

import { Text, Button, View, TextInput, StyleSheet } from 'react-native'
import { register, login } from '../api'
import Md5 from 'react-native-md5'
import Storage from '../utils/storage'
export default class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '1',
      password: '1'
    }
  }

  // 设置顶部导航栏的相关样式
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state
    return {
      title: '登录'
    }
  }

  handleLogin() {
    let _this = this
    let data = {
      username: this.state.username,
      // password: this.state.password
      password: Md5.hex_md5(this.state.password)
    }
    console.log('login....', data)
    login(data)
      .then(resp => {
        console.log(resp)
        Storage.setItem('token', resp.token)
        _this.props.navigation.navigate('App')
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.loginText}
          placeholder={'请输入用户名'}
          onChangeText={username => this.setState({ username })}
          value={this.state.username}
        />
        <TextInput
          secureTextEntry={true}
          style={styles.loginText}
          placeholder={'请输入密码'}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />

        <View style={styles.btn}>
          <Button
            color={'rgb(171, 149, 109)'}
            onPress={() => this.handleLogin()}
            title={'登录'}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 140
  },
  loginText: {
    borderBottomColor: '#ebebeb',
    borderBottomWidth: 1,
    width: '100%'
  },
  btn: {
    width: 325,
    height: 42,
    borderRadius: 25,
    marginTop: 70
  }
})
