import React from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  StyleSheet
} from 'react-native'
import Alipay from '../utils/Alipay'
import {
  getAddress,
  createOrder,
  getOrderDetail,
  prePay,
  uploadLog
} from '../api'
import Storage from '../utils/storage'
export default class Order extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: null,
      productArr: [],
      account: 0,
      basicInfo: null,
      orderStatus: 0
    }
  }

  componentDidMount() {
    // 监听聚焦事件
    let _this = this
    this.props.navigation.addListener('didFocus', focus => {
      console.log('focus......', focus)

      let params = focus.state.params
      _this.setState({
        ...params
      })
      if (params.from == 'cart') {
        _this.getProductsFromLocal()
      } else {
        getOrderDetail(params.id).then(resp => {
          console.log('........获取订单的详情', resp)

          _this.setState({
            orderStatus: resp.status,
            productArr: resp.snap_items,
            account: resp.total_price,
            basicInfo: {
              orderTime: resp.create_time,
              orderNo: resp.order_no
            }
          })
        })
      }
    })
    console.log('....order.....')
    getAddress().then(resp => {
      console.log('address', resp)
      this.setState({
        address: resp
      })
    })
  }

  /**
   * 从本地缓存中取数据
   */
  async getProductsFromLocal() {
    let cart = await Storage.getItem('cart')
    console.log('本地的商品', cart)
    if (cart.length > 0) {
      var newRes = []
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].selectStatus) {
          newRes.push(cart[i])
        }
      }
      this.setState({
        productArr: newRes
      })
    }
  }

  /**
   * 导航栏设置
   */
  static navigationOptions = ({ navigation }) => {
    return {
      title: '订单详情'
    }
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
            from: 'order'
          })
        } else {
          //支付失败
          _this.props.navigation.navigate('PayResult', {
            id: orderData.id,
            result: false,
            from: 'order'
          })
        }
      })
      .catch(err => {
        console.log('err=' + err)
        uploadLog(err)
        this.refs.toast.show('支付失败')
      })
  }

  _firstPay() {
    let _this = this
    var orderInfo = [],
      procuctInfo = this.state.productArr
    for (let i = 0; i < procuctInfo.length; i++) {
      orderInfo.push({
        product_id: procuctInfo[i].id,
        count: procuctInfo[i].counts
      })
    }

    /**
     * 创建订单
     */
    createOrder({ products: orderInfo }).then(resp => {
      console.log('..createOrder<<<', resp)
      if (resp.pass) {
        // 移除购物车中的数据
        var ids = _this.state.productArr.map(p => p.id)
        _this.deleteProduct(ids)

        // 预付款
        let data = {
          id: resp.order_id,
          type: 'alipay'
        }

        this._execPay(data)
      }
    })
  }

  /*购物车中是否已经存在该商品*/
  _isHasThatOne(id, arr) {
    var item,
      result = {
        index: -1
      }
    for (let i = 0; i < arr.length; i++) {
      item = arr[i]
      if (item.id == id) {
        result = {
          index: i,
          data: item
        }
        break
      }
    }
    return result
  }

  /**
   * 删除本地购物车里的数据
   * @param {*} ids
   */
  async deleteProduct(ids) {
    if (!(ids instanceof Array)) {
      ids = [ids]
    }
    let cartData = await Storage.getItem('cart')
    for (let i = 0; i < ids.length; i++) {
      var hasInfo = this._isHasThatOne(ids[i], cartData)
      if (hasInfo.index != -1) {
        cartData.splice(hasInfo.index, 1) //删除数组某一项
      }
    }
    console.log('删除数据后，需要保存的数据', cartData)
    Storage.setItem('cart', cartData)
  }

  /**
   * 处理支付
   */
  handlePay() {
    if (this.state.from == 'cart') {
      this._firstPay()
    } else {
    }
  }

  handleEditAddress(){

  }
  
  render() {
    const address = this.state.address
    const basicInfo = this.state.basicInfo
    return (
      <View style={styles.container}>
        {basicInfo ? (
          <View style={styles.orderBasicBox}>
            <View style={styles.orderBasicLeft}>
              <View style={styles.basicItem}>
                <Text style={styles.basicItemKey}>下单时间：</Text>
                <Text style={styles.basicItemValue}>{basicInfo.orderTime}</Text>
              </View>
              <View style={styles.basicItem}>
                <Text style={styles.basicItemKey}>订单编号：</Text>
                <Text style={styles.basicItemValue}>{basicInfo.orderNo}</Text>
              </View>
            </View>
            <View style={styles.orderBasicRight}>
              {this.state.orderStatus == 1 ? (
                <Text style={styles.unpay}>待付款</Text>
              ) : null}
              {this.state.orderStatus == 2 ? (
                <Text style={styles.payed}>已付款</Text>
              ) : null}
              {this.state.orderStatus == 3 ? (
                <Text style={styles.done}>已发货</Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {address ? (
          <View style={styles.addressBox}>
            <View style={styles.leftBox}>
              <View style={styles.topContent}>
                <View style={[styles.user, styles.dirRow]}>
                  <Image
                    style={styles.smallImg}
                    source={require('../images/icon/user.png')}
                  />
                  <Text>{address.name}</Text>
                </View>
                <View style={[styles.mobile, styles.dirRow]}>
                  <Image
                    style={styles.smallImg}
                    source={require('../images/icon/mobile.png')}
                  />
                  <Text>{address.mobile}</Text>
                </View>
              </View>
              <View style={styles.bottomContent}>
                <Text>{`${address.province}${address.city}${address.country}${
                  address.detail
                }`}</Text>
              </View>
            </View>
            {this.state.orderStatus <= 1 ? (
              <View style={styles.rightArrow}>
                <TouchableOpacity activeOpacity={0.9} onPress={()=>this.handleEditAddress()}>
                <Image
                  source={require('../images/icon/arrowright.png')}
                  style={styles.rightArrowImg}
                />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ) : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.productArr.length > 0
            ? this.state.productArr.map((product, index) => (
                <View style={styles.item} key={index}>
                  <View style={styles.leftItem}>
                    <Image
                      style={styles.leftImg}
                      source={{ uri: product.main_img_url }}
                    />
                  </View>
                  <View style={styles.middleItem}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>{product.price}</Text>
                  </View>
                  <View style={styles.rightItem}>
                    <Text style={styles.productCounts}>x{product.counts}</Text>
                  </View>
                </View>
              ))
            : null}
        </ScrollView>
        <View style={styles.bottomBox}>
          <View style={styles.accountInfo}>
            <Text style={styles.account}>付款合计：￥{this.state.account}</Text>
          </View>
          {this.state.orderStatus <= 1 ? (
            <TouchableOpacity
              onPress={() => this.handlePay()}
              style={styles.payBtn}
              activeOpacity={0.9}
            >
              <Text style={styles.payText}>去付款</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  },
  orderBasicBox: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderBottomColor: '#e9e9e9',
    paddingTop: 10,
    paddingBottom: 2,
    paddingLeft: 20,
    paddingRight: 20
  },
  orderBasicLeft: {
    flex: 1
  },
  orderBasicRight: {
    width: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  basicItem: {
    flexDirection: 'row',
    paddingBottom: 8
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
  addressBox: {
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff'
  },
  smallImg: {
    width: 16,
    height: 16,
    marginRight: 5
  },
  dirRow: {
    flexDirection: 'row'
  },
  topContent: {
    flexDirection: 'row',
    marginBottom: 13,
    justifyContent: 'space-between'
  },
  leftBox: {
    flex: 1
  },
  rightArrow: {
    width: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  item: {
    height: 90,
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9e9e9',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  leftItem: {
    backgroundColor: '#f5f6f5',
    borderRadius: 2,
    width: 90
  },
  leftImg: {
    width: '100%',
    height: '100%'
  },
  middleItem: {
    flex: 1,
    paddingLeft: 10
  },
  productName: { marginTop: 7, marginBottom: 8 },
  productPrice: {
    marginTop: 7,
    marginBottom: 8
  },
  rightItem: {
    width: 40,
    textAlign: 'center',
    alignItems: 'center'
  },
  bottomBox: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 46,
    flexDirection: 'row'
  },
  accountInfo: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  account: {
    color: '#93312e'
  },
  payBtn: {
    backgroundColor: '#ab956d',
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  payText: {
    color: '#fff'
  }
})
