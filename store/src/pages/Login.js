import React, { Component } from 'react'

import {
  Text,
  TouchableOpacity,
  Button,
  View,
  TextInput,
  StyleSheet
} from 'react-native'
import { register, login } from '../api'
import Md5 from 'react-native-md5'
import Storage from '../utils/storage'
export default class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      login: true, // 标记是注册还是登录
      validate_username: null,
      validate_password: null,
      validate_confirmPassword: null
    }
  }

  // 设置顶部导航栏的相关样式
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params ? navigation.state.params.title : '登录'
    }
  }

  handleLogin() {
    let _this = this
    let data = {
      username: this.state.username,
      password: Md5.hex_md5(this.state.password)
    }
    login(data)
      .then(resp => {
        Storage.setItem('token', resp.token)
        _this.props.navigation.navigate('App')
      })
      .catch(err => {
        console.log(err)
      })
  }

  /**
   * 处理注册
   */
  handleTypeChange() {
    let title = this.state.login ? '注册' : '登录'
    let login = !this.state.login
    this.props.navigation.setParams({
      title
    })
    this.setState({
      login
    })
  }

  handleRegister() {
    let _this = this
    if (
      this.state.validate_username &&
      this.state.validate_password &&
      this.state.validate_confirmPassword
    ) {
      // 都验证通过了，执行注册逻辑
      if (this.state.password !== this.state.confirmPassword) {
        return
      }

      let data = {
        username: this.state.username,
        // password: this.state.password
        password: Md5.hex_md5(this.state.password)
      }
      register(data)
        .then(resp => {
          _this.setState({
            login: true
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  /**
   * 验证规则
   * @param {*} key
   */
  handleValidate(key) {
    let validateKey = `validate_${key}`
    this.setState({
      [validateKey]: !!this.state[key]
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
          onBlur={() => this.handleValidate('username')}
        />
        {this.state.validate_username == false ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>请输入用户名</Text>
          </View>
        ) : null}
        <TextInput
          secureTextEntry={true}
          style={styles.loginText}
          placeholder={'请输入密码'}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          onBlur={() => this.handleValidate('password')}
        />
        {this.state.validate_password == false ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>请输入密码</Text>
          </View>
        ) : null}

        {!this.state.login ? (
          <View style={{ width: '100%' }}>
            <TextInput
              secureTextEntry={true}
              style={styles.loginText}
              placeholder={'请输入确认密码'}
              onChangeText={confirmPassword =>
                this.setState({ confirmPassword })
              }
              value={this.state.confirmPassword}
              onBlur={() => this.handleValidate('confirmPassword')}
            />
            {this.state.validate_confirmPassword == false ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>请输入确认密码</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.registerBox}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.handleTypeChange()}
          >
            <Text style={styles.registerText}>
              {this.state.login ? '还没有账号？赶紧注册' : '已有账号？返回登录'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btn}>
          {this.state.login ? (
            <Button
              color={'rgb(171, 149, 109)'}
              onPress={() => this.handleLogin()}
              title={'登录'}
            />
          ) : (
            <Button
              color={'rgb(171, 149, 109)'}
              onPress={() => this.handleRegister()}
              title={'注册'}
            />
          )}
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
  registerBox: {
    marginTop: 40
  },
  errorBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  errorText: {
    color: 'red',
    textAlign: 'left'
  },
  btn: {
    width: 325,
    height: 42,
    borderRadius: 25,
    marginTop: 20
  },
  registerText: {
    color: 'rgb(171, 149, 109)'
  }
})
