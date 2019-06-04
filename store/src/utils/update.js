import React, { Component } from 'react'

import {
  StyleSheet,
  Platform,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Linking
} from 'react-native'

import {
  isFirstTime,
  isRolledBack,
  packageVersion,
  currentVersion,
  checkUpdate,
  downloadUpdate,
  switchVersion,
  switchVersionLater,
  markSuccess
} from 'react-native-update'

import _updateConfig from '../../update.json'
const { appKey } = _updateConfig[Platform.OS]

let fundebug = require('fundebug-reactnative')
fundebug.init({
  apikey: '89f568272dd69fe7b69c0f8305365dc4ccd323fddc3e738922a1bea9984b3392'
})

export default class Update extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    let _this = this
    if (isFirstTime) {
      checkUpdate(appKey)
        .then(info => {
          if (info.expired) {
            Alert.alert(
              '提示',
              '您的应用版本已更新,请前往应用商店下载新的版本',
              [
                {
                  text: '确定',
                  onPress: () => {
                    info.downloadUrl && Linking.openURL(info.downloadUrl)
                  }
                }
              ]
            )
          } else if (info.upToDate) {
            // Alert.alert('提示', '您的应用版本已是最新.')
          } else {
            Alert.alert(
              '提示',
              '检查到新的版本' + info.name + ',是否下载?\n' + info.description,
              [
                {
                  text: '是',
                  onPress: () => {
                    _this.doUpdate(info)
                  }
                },
                {
                  text: '否'
                }
              ]
            )
          }
        })
        .catch(err => {
          fundebug.notify('err', err)
          Alert.alert('提示', '更新失败.' + err)
        })
    }
  }

  doUpdate(info) {
    downloadUpdate(info)
      .then(hash => {
        Alert.alert('提示', '下载完毕,是否重启应用?', [
          {
            text: '是',
            onPress: () => {
              markSuccess() // 标记使用成功
              switchVersion(hash)
              fundebug.notify('ok', info)
            }
          },
          {
            text: '否'
          },
          {
            text: '下次启动时',
            onPress: () => {
              markSuccess() // 标记使用成功
              switchVersionLater(hash)
            }
          }
        ])
      })
      .catch(err => {
        fundebug.notify('err', err)
        Alert.alert('提示', '更新失败.' + err)
      })
  }
  render() {
    return <View />
  }
}
