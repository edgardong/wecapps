import React from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  Picker,
  TouchableOpacity,
  ScrollView
} from 'react-native'

import { getProductDetail } from '../api'
import Storage from '../utils/storage'
import WECPicker from '../components/picker'
import { withNavigationFocus } from 'react-navigation'

export default withNavigationFocus(
  class Product extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        product: null,
        productCounts: '1',
        cartTotalCounts: 0,
        productIndex: 0,
        showModal: false,
        tabIndex: 0,
        pickers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      }

      this.handleOk = this.handleOk.bind(this)
      this.handleCancel = this.handleCancel.bind(this)
      this.handleTabToCart = this.handleTabToCart.bind(this)
    }

    static navigationOptions = ({ navigation }) => {
      return {
        title: '商品详情'
      }
    }

    componentWillMount() {
      const id = this.props.navigation.getParam('id')
      getProductDetail(id).then(resp => {
        this.setState({
          product: resp
        })
      })

      this._calTotalCount()
    }

    async _calTotalCount(data) {
      if (!data) {
        data = await Storage.getItem('cart')
      }
      let cartTotalCounts = 0
      for (let i = 0; i < data.length; i++) {
        if (data[i].selectStatus) {
          cartTotalCounts += data[i].counts
        }
      }
      this.setState({
        cartTotalCounts
      })
    }

    /**
     * 处理底部tab变化
     * @param {*} index tab索引
     */
    handleTabChange(index) {
      this.setState({
        tabIndex: index
      })
    }

    /**
     * 添加数量
     */
    handleAddCount() {
      this.setState({
        showModal: true
      })
    }

    handleCancel() {
      this.setState({
        showModal: false
      })
    }

    /**
     * 成功处理事件
     * @param {*} index 索引
     * @param {*} item 
     */
    handleOk(index, item) {
      this.setState({
        showModal: false,
        productIndex: index,
        productCounts: item
      })
    }

    /**
     * 添加都购物车
     * @param {*} product 商品
     */
    handleAddToCart(product) {
      console.log(product)

      let tmpObj = {}
      let keys = ['id', 'name', 'main_img_url', 'price']

      for (let key in product) {
        if (keys.indexOf(key) >= 0) {
          tmpObj[key] = product[key]
        }
      }

      this.add(tmpObj, this.state.productCounts)
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

    /*
     * 加入到购物车
     * 如果之前没有样的商品，则直接添加一条新的记录， 数量为 counts
     * 如果有，则只将相应数量 + counts
     * @params:
     * item - {obj} 商品对象,
     * counts - {int} 商品数目,
     * */
    async add(item, counts) {
      let cartData = await Storage.getItem('cart')

      console.log('缓存里面数据，购物车', cartData)

      if (!cartData) {
        cartData = []
      }
      var isHadInfo = this._isHasThatOne(item.id, cartData)
      //新商品
      if (isHadInfo.index == -1) {
        item.counts = Number(counts)
        item.selectStatus = true //默认在购物车中为选中状态
        cartData.push(item)
      }
      //已有商品
      else {
        let cartCount = Number(cartData[isHadInfo.index].counts)
        console.log('cartCount>>>', cartCount)
        cartData[isHadInfo.index].counts = cartCount + Number(counts)
      }

      // 计算购物车里的总数量
      this._calTotalCount(cartData)
      console.log('购物车里面的数据', cartData)

      let data = await Storage.setItem('cart', cartData) //更新本地缓存
      console.log('缓存数据的返回值', data)
      return cartData
    }

    handleTabToCart() {
      console.log('我要去购物车页面')
      this.props.navigation.navigate('Cart')
    }

    render() {
      const product = this.state.product
      return product ? (
        <View style={styles.container}>
          <WECPicker
            index={this.state.productIndex}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            showModal={this.state.showModal}
            dataSource={this.state.pickers}
          />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.handleTabToCart()}
            style={styles.topCartBox}
          >
            <Image
              style={styles.topCart}
              source={require('../images/icon/carttop.png')}
            />
            {this.state.cartTotalCounts > 0 ? (
              <Text style={styles.cartTotalCounts}>
                {this.state.cartTotalCounts}
              </Text>
            ) : null}
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.topBox}>
              {/* 商品主图 */}
              <Image
                style={styles.headImage}
                source={{ uri: product.main_img_url }}
              />
              {/* 中部加入购物车区域 */}
              <View style={styles.cartBox}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.handleAddCount()}
                  style={[styles.cartItem, styles.cartLeftItem]}
                >
                  <Text style={styles.colorWhite}>数量</Text>
                  {/* <Picker
                    style={[{ height: 50, width: 80 }, styles.colorWhite]}
                    selectedValue={this.state.productCounts}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ productCounts: itemValue })
                    }
                  >
                    {this.state.pickers.map(pic => (
                      <Picker.Item
                        style={styles.colorWhite}
                        key={pic}
                        label={pic}
                        value={pic}
                      />
                    ))}
                  </Picker> */}

                  {/* <Text style={styles.colorWhite}>数量</Text> */}
                  <Text style={styles.colorWhite}>
                    {this.state.productCounts}
                  </Text>
                  <Image
                    style={styles.iconDown}
                    source={require('../images/icon/arrowdown.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.handleAddToCart(product)}
                  activeOpacity={0.9}
                  style={[styles.cartItem, styles.cartRightItem]}
                >
                  <Text style={styles.colorWhite}>加入购物车</Text>
                  <Image
                    style={styles.iconCart}
                    source={require('../images/icon/cart.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoStock}>
                {product.stock > 0 ? '有货' : '无货'}
              </Text>
              <Text style={styles.infoName}>{product.name}</Text>
              <Text style={styles.infoPrice}>¥ {product.price}</Text>
            </View>
            <View style={styles.bottomBox}>
              <View style={styles.tabBox}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[
                    styles.tabItem,
                    this.state.tabIndex == 0 ? styles.activeItem : ''
                  ]}
                  onPress={() => this.handleTabChange(0)}
                >
                  <Text
                    style={[
                      styles.itemText,
                      this.state.tabIndex == 0 ? styles.activeText : ''
                    ]}
                  >
                    商品详情
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[
                    styles.tabItem,
                    this.state.tabIndex == 1 ? styles.activeItem : ''
                  ]}
                  onPress={() => this.handleTabChange(1)}
                >
                  <Text
                    style={[
                      styles.itemText,
                      this.state.tabIndex == 1 ? styles.activeText : ''
                    ]}
                  >
                    产品参数
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[
                    styles.tabItem,
                    this.state.tabIndex == 2 ? styles.activeItem : ''
                  ]}
                  onPress={() => this.handleTabChange(2)}
                >
                  <Text
                    style={[
                      styles.itemText,
                      this.state.tabIndex == 2 ? styles.activeText : ''
                    ]}
                  >
                    售后服务
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 底部商品详情 */}
              {this.state.tabIndex == 0 ? (
                product.imgs.map(img => (
                  <Image
                    style={styles.detailImg}
                    key={img.id}
                    source={{ uri: img.img_url.url }}
                  />
                ))
              ) : this.state.tabIndex == 1 ? (
                product.properties.map((pro, index) => (
                  <View key={index} style={styles.propertiyItem}>
                    <Text style={styles.propertyName}>{pro.name}</Text>
                    <Text style={styles.propertyDetail}>{pro.detail}</Text>
                    {index == product.properties.length - 1 ? (
                      <View style={{ height: 100 }} />
                    ) : null}
                  </View>
                ))
              ) : this.state.tabIndex == 2 ? (
                <View>
                  <Text style={{ textAlign: 'center' }}>七天无理由退款</Text>
                  <View style={{ height: 100 }} />
                </View>
              ) : null}
            </View>
          </ScrollView>
        </View>
      ) : null
    }
  }
)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topCartBox: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 64,
    height: 64,
    zIndex: 1
  },
  topCart: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32
  },
  cartTotalCounts: {
    fontSize: 12,
    backgroundColor: '#ab956d',
    color: 'white',
    position: 'absolute',
    right: 45,
    top: 12,
    height: 18,
    width: 18,
    borderRadius: 18,
    textAlign: 'center'
  },
  topBox: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  headImage: {
    width: '100%',
    height: 280
  },
  colorWhite: {
    color: '#ffffff'
  },
  cartBox: {
    width: 330,
    height: 50,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 50,
    backgroundColor: 'rgb(171, 149, 109)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  },
  cartItem: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    color: '#fff'
  },
  cartLeftItem: {
    borderRightColor: '#fff',
    borderRightWidth: 2,
    borderStyle: 'dashed'
  },
  cartRightItem: {},
  iconDown: {
    width: 24,
    height: 24
  },
  iconCart: {
    width: 16,
    height: 16
  },
  infoBox: {
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 8
  },
  infoStock: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5
  },
  infoName: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 5,
    marginBottom: 5
  },
  infoPrice: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5
  },
  bottomBox: {
    marginTop: 15
  },
  tabBox: {
    flexDirection: 'row',
    height: 45,
    marginBottom: 8,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activeItem: {
    borderBottomColor: 'rgba(171, 149, 109, 0.8)',
    borderBottomWidth: 2
  },
  tabItem: {
    flex: 1,
    textAlign: 'center',
    height: 45,
    alignItems: 'center',
    borderBottomColor: 'rgb(208, 208, 215)',
    borderBottomWidth: 1
  },
  itemText: {
    fontSize: 14,
    color: 'rgb(199, 199, 203)'
  },
  activeText: {
    color: 'rgba(171, 149, 109, 0.8)'
  },
  detailImg: {
    width: '100%',
    height: 220,
    resizeMode: 'cover'
  },
  propertiyItem: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8
  },
  propertyName: {
    width: 80,
    fontSize: 12,
    color: 'rgb(128, 128, 128)',
    textAlign: 'center'
  },
  propertyDetail: {
    fontSize: 12,
    color: 'rgb(51, 51, 51)',
    flex: 1
  }
})
