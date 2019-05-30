import React from 'react'

import {
  View,
  Image,
  Button,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native'

export default class PayResult extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      from: '',
      result: false
    }
  }

  componentDidMount() {
    let params = this.props.navigation.state.params
    console.log('支付结果参数', params)
    this.setState({
      ...params
    })
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: '支付结果'
    }
  }

  handleViewOrder() {
    this.props.navigation.navigate('Order', {
      id: this.state.id,
      from: 'order'
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.result ? (
          <View style={styles.centerContent}>
            <Image
              style={styles.payImg}
              source={require('../images/icon/paysuccess.png')}
            />
            <Text style={styles.payText}>支付成功</Text>
          </View>
        ) : (
          <View style={styles.centerContent}>
            <Image
              style={styles.payImg}
              source={require('../images/icon/payerror.png')}
            />
            <Text style={styles.payText}>支付失败</Text>
          </View>
        )}
        <View style={styles.bottomBtn}>
          <TouchableOpacity
            onPress={() => this.handleViewOrder()}
            activeOpacity={0.9}
          >
            <Text style={styles.btnText}>查看订单</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  payImg: {
    width: 100,
    height: 100
  },
  payText: {
    marginTop: 10,
    fontSize: 20,
    color: 'black'
  },
  centerContent: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomBtn: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ebebeb'
  },
  btnText: {
    fontSize: 20,
    color: 'rgb(171, 149, 109)'
  }
})
