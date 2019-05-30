import React, { Component } from 'react'
import { withNavigationFocus, SwitchActions } from 'react-navigation'
import {
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Platform
} from 'react-native'
import Storage from '../utils/storage'
import { getMyOrders, getAddress, prePay, uploadLog } from '../api'
import Alipay from '../utils/Alipay'

export default class My extends Component {
  constructor(props) {
    super(props)

    this.state = {
      address: null,
      orders: [],
      params: {
        page: 1
      },
      pageInfo: {
        has_more: false,
        per_page: 1
      }
    }
  }

  _loadOrderData() {
    let _this = this
    console.log(this.state.params)
    getMyOrders(this.state.params).then(orders => {
      console.log('我的订单数据', orders)
      let orderList = []
      if (this.state.params.page == 1) {
        orderList = orders.data.data
      } else {
        orderList = this.state.orders
        orderList.push.apply(orderList, orders.data.data)
      }
      _this.setState({
        orders: orderList,
        pageInfo: {
          has_more: orders.data.has_more,
          per_page: orders.data.per_page
        }
      })
    })
  }

  async _loadData(focus) {
    let _this = this
    let user = await Storage.getItem('token')
    if (!user) {
      _this.props.navigation.navigate('Login')
    } else {
      getAddress().then(res => {
        console.log('用户地址信息', res)
        _this.setState({
          address: res
        })
      })
      _this._loadOrderData()
    }
  }

  componentDidMount() {
    let _this = this
    this.props.navigation.addListener('didFocus', focus => {
      _this._loadData(focus)
    })
  }

  // 设置顶部导航栏的相关样式
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    return {
      title: '我的',
      headerTitle: '我的'
    }
  }

  /**
   * 处理支付
   */
  handlePay(order) {
    console.log('handlePay.....', order)
    // 预付款
    let data = {
      id: order.id,
      type: 'alipay'
    }

    this._execPay(data)
  }

  /**
   * 执行支付过程
   * @param {*} data
   */
  _execPay(data) {
    let _this = this
    prePay(data).then(res => {
      console.log('prepay', res)
      _this.aliPayAction(res, data)
    })
  }

  /**
   * 执行app支付
   * @param {*} payStr 支付字符串
   * @param {*} orderData 订单数据
   */
  async aliPayAction(payStr, orderData) {
    let _this = this
    //payStr为从后台获取的支付字符串
    Alipay.pay(payStr)
      .then(data => {
        console.log('支付结果', data)
        console.log('使用平台', Platform)
        let resultDic = {}
        /*笔者iOS端和安卓端返回的支付回调结果数据不一致，可能和支付宝sdk版本有关，
读者可自行根据返回数据进行相关处理，iOS(RCTAlipay.m)和安卓(AlipayModule)
可自行选择需要resolve回调判断处理的数据，如只返回resultStatus*/
        if (Platform.OS === 'ios') {
          resultDic = data[0]
        } else {
          resultDic = data
        }
        if (resultDic.resultStatus == '9000') {
          //支付成功
          _this.props.navigation.navigate('PayResult', {
            id: orderData.id,
            result: true,
            from: 'my'
          })
        } else {
          //支付失败
          _this.props.navigation.navigate('PayResult', {
            id: orderData.id,
            result: false,
            from: 'my'
          })
        }
      })
      .catch(err => {
        console.log('err=' + err)
        uploadLog(err)
      })
  }

  handleClearCache() {
    let _this = this
    Storage.removeItem('token')
      .then(resp => {
        _this.props.navigation.navigate('Home')
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  handleScrollEnd(e) {
    // console.log(e.nativeEvent)

    var offsetY = e.nativeEvent.contentOffset.y //滑动距离
    var contentSizeHeight = e.nativeEvent.contentSize.height //scrollView contentSize高度
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height //scrollView高度
    if (parseInt(offsetY + oriageScrollHeight) >= parseInt(contentSizeHeight)) {
      // console.log('上传滑动到底部事件')
      if (this.state.pageInfo.has_more) {
        let nextPage = this.state.params.page + 1
        this.setState({
          params: {
            page: nextPage
          }
        })
        this._loadOrderData()
      }
    }
  }

  render() {
    const address = this.state.address
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScrollEndDrag={e => this.handleScrollEnd(e)}
        >
          <View style={styles.title}>
            <Text style={styles.titleText}>地址管理</Text>
          </View>

          {address ? (
            <View style={styles.addressBox}>
              <View style={styles.addressItem}>
                <Text style={styles.addressText}>姓名：{address.name}</Text>
              </View>
              <View style={styles.addressItem}>
                <Text style={styles.addressText}>电话：{address.mobile}</Text>
              </View>
              <View style={styles.addressItem}>
                <Text style={styles.addressText}>
                  地址：
                  {`${address.province}${address.city}${address.country}${
                    address.detail
                  }`}
                </Text>
              </View>
            </View>
          ) : null}

          {this.state.orders.length > 0 ? (
            <View>
              <View style={styles.title}>
                <Text style={styles.titleText}>我的订单</Text>
              </View>
              {this.state.orders.map((order, index) => (
                <View style={styles.orderItem} key={index}>
                  <View style={styles.itemTopBox}>
                    <Text>订单编号：</Text>
                    <Text>{order.order_no}</Text>
                  </View>
                  <View style={styles.itemMiddleBox}>
                    <Image
                      style={styles.middleImage}
                      source={{ uri: order.snap_img }}
                    />
                    <View style={styles.middleContent}>
                      <Text>{order.snap_name}</Text>
                      <Text>{order.total_count}件商品</Text>
                    </View>
                    <View style={styles.middleStatus}>
                      {order.status == 1 ? (
                        <Text style={styles.unpay}>待付款</Text>
                      ) : null}
                      {order.status == 2 ? (
                        <Text style={styles.payed}>已付款</Text>
                      ) : null}
                      {order.status == 3 ? (
                        <Text style={styles.done}>已发货</Text>
                      ) : null}
                    </View>
                  </View>
                  {order.status == 1 ? (
                    <View style={styles.itemBottomBox}>
                      <Text>实付:￥{order.total_price}</Text>
                      <TouchableOpacity
                        style={styles.btnPay}
                        activeOpacity={0.9}
                        onPress={() => this.handlePay(order)}
                      >
                        <Text style={styles.btnPayTxt}>付款</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>

        <View>
          <Button title={'清除缓存'} onPress={() => this.handleClearCache()} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed'
  },
  addressBox: {
    marginBottom: 8,
    backgroundColor: '#fff'
  },
  addressItem: {
    marginLeft: 15,
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb'
  },
  addressText: {
    color: '#7c7c7c',
    fontSize: 14,
    paddingTop: 10,
    paddingRight: 15,
    paddingBottom: 10
  },
  title: {
    height: 45,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb'
  },
  titleText: {
    fontSize: 16
  },
  orderItem: {
    marginBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    width: '100%',
    backgroundColor: '#fff'
  },
  itemTopBox: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb'
  },
  itemMiddleBox: {
    height: 75,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  itemBottomBox: {
    height: 45,
    borderTopWidth: 1,
    borderTopColor: '#ebebeb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  middleImage: {
    width: 75,
    height: '100%',
    borderRadius: 2
  },
  middleContent: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center'
  },
  middleStatus: {
    width: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  unpay: {
    color: '#B42F2D'
  },
  payed: {
    color: '#AB956D'
  },
  done: {
    color: '#57AB53'
  },
  btnPay: {
    width: 85,
    height: 30,
    backgroundColor: '#b42f2d',
    borderRadius: 2,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnPayTxt: {
    color: '#fff',
    textAlign: 'center'
  }
})
