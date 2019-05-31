import React from 'react'

import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity
} from 'react-native'

import Storage from '../utils/storage'
import { getAllArea } from '../api'
import AreaPicker from '../components/picker/AreaPicker'
export default class Address extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      areas: null,
      province: '',
      city: '',
      country: '',
      detail: '',
      showPicker: false,
      default: ['', '', '']
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: '地址管理'
    }
  }

  componentDidMount() {
    let _this = this
    this.props.navigation.addListener('didFocus', focus => {
      _this._getAreaData()
    })
  }

  async _getAreaData() {
    console.log('我要开始获取所有的区域数据了')
    let areas = await Storage.getItem('base_area')
    console.log('本地you 数据了饿么？', areas)
    if (!areas) {
      getAllArea().then(resp => {
        console.log('所有的区域', resp)
        Storage.setItem('base_area', resp)
        this.setState({
          areas: resp
        })
      })
    } else {
      this.setState({
        areas: areas
      })
    }
  }

  handleChooseArea() {
    this.setState({
      showPicker: true
    })
  }
  handleOk(index, item) {}

  handleCancel() {
    this.setState({
      showPicker: false
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <AreaPicker
          index={this.state.default}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
          dataSource={this.state.areas}
          showModal={this.state.showPicker}
        />

        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            height: 40,
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row'
          }}
          onPress={() => this.handleChooseArea()}
        >
          <Text>省/市/区</Text>
          <Text>{`${this.state.province}${this.state.city}${
            this.state.country
          }`}</Text>
        </TouchableOpacity>

        <TextInput
          style={{
            height: 80,
            borderColor: '#ebebeb',
            borderWidth: 1
          }}
          multiline={true}
          placeholder="请输入详细地址"
          onChangeText={detail => this.setState({ detail })}
          value={this.state.detail}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
