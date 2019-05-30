import React, { Component } from 'react'
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native'
import { withNavigation, withNavigationFocus } from 'react-navigation'

import Storage from '../utils/storage'

export default withNavigationFocus(
  class Cart extends Component {
    constructor(props) {
      super(props)
      this.state = {
        cart: [],
        selectedCounts: 0,
        account: 0,
        selectedTypeCounts: 0
      }
    }

    cart = []

    async componentDidUpdate() {
      console.log('componentDidUpdate', this.props)
      if (this.props.isFocused) {
        console.log('props....')
        let user = await Storage.getItem('token')
        console.log('user', user)
        if (!user) {
          this.props.navigation.navigate('Login')
        } else {
          let cacheCart = await Storage.getItem('cart')
          console.log('cacheCart', cacheCart)
          console.log('...', this.cart)
          if (JSON.stringify(this.cart) != JSON.stringify(cacheCart)) {
            this.cart = cacheCart
            this.updateCart(this.cart)
          }
        }
      }
    }

    // 设置顶部导航栏的相关样式
    static navigationOptions = ({ navigation }) => {
      return {
        title: '购物车'
      }
    }

    /**
     * 添加到购物车
     */
    addCountToCart(data, number) {
      let productIndex = this.cart.findIndex(car => car.id == data.id)
      console.log('productIndex', productIndex)
      if (this.cart[productIndex].counts <= 1 && number == -1) {
        return
      }
      this.cart[productIndex].counts += number

      this.updateCart(this.cart)
    }

    async updateCart(cart) {
      let result = await Storage.setItem('cart', cart) //更新本地缓存
      let cacheResult = this._calcTotalAccountAndCounts(cart)
      this.setState({
        cart,
        ...cacheResult
      })
      console.log('缓存数据的返回值', result)
    }

    /*
     * 计算总金额和选择的商品总数
     * */
    _calcTotalAccountAndCounts(data) {
      var len = data.length,
        account = 0, // 需要计算的以选中的商品的总价格
        selectedCounts = 0, // 选中的商品数
        selectedTypeCounts = 0 // 选中的类别数量
      let multiple = 100
      for (let i = 0; i < len; i++) {
        //避免 0.05 + 0.01 = 0.060 000 000 000 000 005 的问题，乘以 100 *100
        if (data[i].selectStatus) {
          account +=
            data[i].counts * multiple * Number(data[i].price) * multiple
          selectedCounts += data[i].counts
          selectedTypeCounts++
        }
      }
      return {
        selectedCounts: selectedCounts,
        selectedTypeCounts: selectedTypeCounts,
        account: account / (multiple * multiple)
      }
    }

    /**
     * 从购物车中移除商品
     * @param {*} data 移除的商品
     */
    removeFromCart(data) {
      let productIndex = this.cart.findIndex(car => car.id == data.id)
      this.cart.splice(productIndex, 1)
      console.log('cart....remove,', this.cart)
      this.updateCart(this.cart)
    }

    /**
     * 切换选中状态
     * @param {*} data
     */
    changeChooseStatus(data) {
      let productIndex = this.cart.findIndex(car => car.id == data.id)
      this.cart[productIndex].selectStatus = !this.cart[productIndex]
        .selectStatus
      console.log('cart....remove,', this.cart)
      this.updateCart(this.cart)
    }

    toogleChooseAll() {
      let result = this.state.selectedTypeCounts == this.cart.length

      this.cart.forEach(car => {
        car.selectStatus = !result
      })

      this.updateCart(this.cart)
    }

    handleOrder() {
      this.props.navigation.navigate('Order', {
        from: 'cart',
        account: this.state.account
      })
    }

    render() {
      return (
        <View style={{ flex: 1 }}>
          {this.state.cart.length > 0 ? (
            <View style={{ flex: 1 }}>
              <ScrollView>
                {this.state.cart.map((data, index) => (
                  <View style={styles.item} key={data.id}>
                    <TouchableOpacity
                      onPress={() => this.changeChooseStatus(data)}
                      activeOpacity={1}
                      style={styles.leftBtn}
                    >
                      {data.selectStatus ? (
                        <Image
                          style={styles.checkbtn}
                          source={require('../images/icon/circleselected.png')}
                        />
                      ) : (
                        <Image
                          style={styles.checkbtn}
                          source={require('../images/icon/circlenoselected.png')}
                        />
                      )}
                    </TouchableOpacity>
                    <View style={styles.imgBox}>
                      <Image
                        style={styles.image}
                        source={{ uri: data.main_img_url }}
                      />
                    </View>
                    <View style={styles.rightBox}>
                      <View style={styles.topContent}>
                        <Text>{data.name}</Text>
                        <Text>¥{data.price}</Text>
                      </View>
                      <View style={styles.bottomContent}>
                        <View style={styles.bottomLeftBox}>
                          <TouchableOpacity
                            style={styles.btnDesc}
                            activeOpacity={0.9}
                            onPress={() => this.addCountToCart(data, -1)}
                          >
                            <Text style={styles.btnTextSize}>-</Text>
                          </TouchableOpacity>
                          <View style={styles.alignCenter}>
                            <Text>{data.counts}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.btnAdd}
                            activeOpacity={0.9}
                            onPress={() => this.addCountToCart(data, 1)}
                          >
                            <Text style={styles.btnTextSize}>+</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.bottomRightBox}>
                          <TouchableOpacity
                            style={styles.btnDel}
                            activeOpacity={0.9}
                            onPress={() => this.removeFromCart(data)}
                          >
                            <Text style={styles.btnTextSize}>x</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.cartfooter}>
                <TouchableOpacity
                  onPress={() => this.toogleChooseAll()}
                  activeOpacity={0.9}
                  style={styles.footerLeft}
                >
                  {this.state.selectedTypeCounts == this.state.cart.length ? (
                    <Image
                      style={styles.footerAllImg}
                      source={require('../images/icon/allselected.png')}
                    />
                  ) : (
                    <Image
                      style={styles.footerAllImg}
                      source={require('../images/icon/all.png')}
                    />
                  )}
                  <Text style={styles.fontWhite}>
                    全选（{this.state.selectedCounts}）
                  </Text>
                </TouchableOpacity>
                {/* 下单部分 */}
                <TouchableOpacity
                  onPress={() => this.handleOrder()}
                  activeOpacity={0.9}
                  style={[styles.footerRigth, styles.alignCenter]}
                >
                  <View style={[styles.alignCenter, styles.text]}>
                    <Text style={styles.fontWhite}>下单</Text>
                  </View>
                  <Text style={[styles.fontWhite, styles.account]}>
                    ¥{this.state.account}
                  </Text>
                  <View style={styles.arrow}>
                    <Image
                      style={styles.arrowImg}
                      source={require('../images/icon/arrow.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.nodata}> 您还没有添加任何商品 </Text>
          )}
        </View>
      )
    }
  }
)

const styles = StyleSheet.create({
  nodata: {
    marginTop: 35,
    color: '#ccc',
    width: '100%',
    textAlign: 'center'
  },
  item: {
    padding: 10,
    height: 93,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    flexDirection: 'row'
  },
  leftBtn: {
    width: 42,
    justifyContent: 'center'
  },
  imgBox: {
    width: 93,
    height: '100%',
    backgroundColor: '#f5f6f5',
    borderRadius: 2
  },
  image: {
    width: '100%',
    height: '100%'
  },
  checkbtn: {
    marginLeft: 10,
    width: 22,
    height: 22
  },
  rightBox: {
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  topContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bottomContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  bottomLeftBox: {
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  fontWhite: {
    color: 'white'
  },
  btnTextSize: {
    fontSize: 25
  },
  btnDesc: {
    paddingLeft: 10,
    paddingRight: 10
  },
  btnAdd: {
    paddingLeft: 10,
    paddingRight: 10
  },
  alignCenter: {
    alignItems: 'center'
  },
  cartfooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#ab956d',
    color: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    height: 46,
    flexDirection: 'row'
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%'
  },
  footerAllImg: {
    width: 24,
    height: 24,
    marginLeft: 10,
    marginRight: 10
  },
  footerRigth: {
    flexDirection: 'row',
    width: '60%'
  },
  text: {
    flex: 5,
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    borderStyle: 'dashed'
  },
  account: {
    flex: 2,
    marginLeft: 5,
    fontSize: 14
  },
  arrow: {
    flex: 3,
    alignItems: 'center'
  },
  arrowImg: {
    width: 16,
    height: 16
  }
})
