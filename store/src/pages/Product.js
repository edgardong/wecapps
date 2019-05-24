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
        tabIndex: 0,
        pickers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      }
    }

    static navigationOptions = ({ navigation }) => {
      const params = navigation
      console.log(params)
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

    render() {
      const product = this.state.product
      return product ? (
        <View>
          <WECPicker dataSource={this.state.pickers} />
          <TouchableOpacity style={styles.topCartBox}>
            <Image
              style={styles.topCart}
              source={require('../images/icon/carttop.png')}
            />
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
                <View style={[styles.cartItem, styles.cartLeftItem]}>
                  <Text style={styles.colorWhite}>数量</Text>
                  <Picker
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
                  </Picker>

                  {/* <Text style={styles.colorWhite}>数量</Text>
                <Text style={styles.colorWhite}>
                  {this.state.productCounts}
                </Text>
                <Image
                  style={styles.iconDown}
                  source={require('../images/icon/arrowdown.png')}
                /> */}
                </View>
                <View style={[styles.cartItem, styles.cartRightItem]}>
                  <Text style={styles.colorWhite}>加入购物车</Text>
                  <Image
                    style={styles.iconCart}
                    source={require('../images/icon/cart.png')}
                  />
                </View>
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
                  </View>
                ))
              ) : this.state.tabIndex == 2 ? (
                <View>
                  <Text style={{ textAlign: 'center' }}>七天无理由退款</Text>
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
  topCartBox: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 32
  },
  topCart: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32
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
