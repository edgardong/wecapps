import React from 'react'

import {
  View,
  StyleSheet,
  Text,
  Image,
  Button,
  ScrollView,
  TextInput,
  TouchableOpacity
} from 'react-native'

import Storage from '../utils/storage'
import { getAllArea, saveAddress } from '../api'
import AreaPicker from '../components/picker/AreaPicker'
export default class Address extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      areas: null,
      province: '',
      name: '',
      mobile: '',
      city: '',
      country: '',
      detail: '',
      showPicker: false,
      default: null,
      height_comments: 40
    }

    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
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

    // 显示默认
    let params = this.props.navigation.state.params
    this.setState({
      
    })
  }

  handleChooseArea() {
    this.setState({
      showPicker: true
    })
  }
  handleOk(area) {
    console.log('....Ok....', area)

    this.setState({
      showPicker: false,
      province: area.province.areaName,
      city: area.city.areaName,
      country: area.country.areaName,
      default: [
        area.province.areaName,
        area.city.areaName,
        area.country.areaName
      ]
    })
  }

  handleCancel() {
    this.setState({
      showPicker: false
    })
  }

  onContentSizeChange(event) {
    this.setState({
      height_comments: event.nativeEvent.contentSize.height
    })
  }

  /**
   * 保存地址
   */
  handleSaveAddress() {
    let data = {
      mobile: this.state.mobile,
      name: this.state.name,
      province: this.state.province,
      city: this.state.city,
      country: this.state.country,
      detail: this.state.detail
    }
    saveAddress(data).then(resp => {
      console.log('保存地址成功', resp)
      this.props.navigation.goBack()
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <AreaPicker
          index={this.state.default}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          dataSource={this.state.areas}
          showModal={this.state.showPicker}
        />

        <TextInput
          style={{
            borderColor: '#ebebeb',
            borderWidth: 1
          }}
          placeholder="请输入联系人"
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />

        <TextInput
          style={{
            borderColor: '#ebebeb',
            borderWidth: 1
          }}
          placeholder="请输入联系方式"
          onChangeText={mobile => this.setState({ mobile })}
          value={this.state.mobile}
        />

        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            height: 50,
            paddingRight: 20,
            alignItems: 'center',
            justifyContent: 'space-between',
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
            height: Math.max(40, this.state.height_comments),
            borderColor: '#ebebeb',
            borderWidth: 1
          }}
          multiline={true}
          placeholder="请输入详细地址"
          onContentSizeChange={this.onContentSizeChange.bind(this)}
          onChangeText={detail => this.setState({ detail })}
          value={this.state.detail}
        />

        <View style={{ marginTop: 30, marginLeft: 30, marginRight: 30 }}>
          <Button
            color={'rgb(171, 149, 109)'}
            title={'保存'}
            onPress={() => this.handleSaveAddress()}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
