import React, { Component } from 'react'
import { getBanner, getTheme, getProducts } from '../api'
import {
  View,
  TouchableOpacity,
  BackHandler,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert
} from 'react-native'
import Swiper from '../components/swiper'
import Products from '../components/products'

import Update from '../utils/update'

export default class Home extends Component {
  _didFocusSubscription
  _willBlurSubscription

  constructor(props) {
    super(props)

    this.handleImageClick = this.handleImageClick.bind(this)

    this._didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid
        )
    )

    this.state = {
      tabIndex: '0',
      titles: ['首页', '分类', '购物车', '我的'],
      banners: [],
      themes: [],
      products: []
    }
  }

  // 设置顶部导航栏的相关样式
  static navigationOptions = ({ navigation }) => {
    return {
      title: '首页'
    }
  }

  /**
   * 生命周期函数
   */
  componentDidMount() {
    let _this = this
    getBanner(1)
      .then(resp => {
        _this.setState({
          banners: resp.items
        })
      })
      .catch(error => {
        console.log(error)
      })

    getTheme().then(resp => {
      _this.setState({
        themes: resp
      })
    })

    getProducts().then(resp => {
      _this.setState({
        products: resp
      })
    })

    this._willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid
        )
    )
  }

  onBackButtonPressAndroid = () => {
    Alert.alert('提示', '是否确定退出APP？', [
      {
        text: '是',
        onPress: () => {
          // 退出APP
          BackHandler.exitApp()
        }
      },
      {
        text: '否',
        onPress: () => true,
        style: 'cancel'
      }
    ])
    return true
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove()
    this._willBlurSubscription && this._willBlurSubscription.remove()
  }

  /**
   * 处理底部tab切换
   * @param {*} index 索引
   */
  handleTabChange(index) {
    this.setState({
      tabIndex: index
    })

    // 设置导航栏标题
    this.props.navigation.setParams({ title: this.state.titles[index] })
  }

  handleImageClick(index, item) {
    this.props.navigation.navigate('Product', { id: item.key_word })
  }

  handleThemeClick(item) {
    this.props.navigation.navigate('Theme', { id: item.id, title: item.name })
  }

  render() {
    return (
      <View style={styles.container}>
        <Update />
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* 顶部轮播图 */}
          <View>
            {this.state.banners.length > 0 ? (
              <Swiper
                onClick={this.handleImageClick}
                items={this.state.banners}
              />
            ) : null}
          </View>

          {/* 精选主题区域 */}
          <View>
            <View style={styles.themeTitle}>
              <Text style={styles.themeTitleText}>精选主题</Text>
            </View>
            <View style={styles.themeBox}>
              {this.state.themes.map((theme, index) => (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.handleThemeClick(theme)}
                  key={theme.id}
                  style={index == 2 ? styles.themeItemBig : styles.themeItem}
                >
                  <Image
                    style={styles.themeImage}
                    source={{ uri: theme.topic_img.url }}
                    key={theme.id}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 最近新品 */}
          <View>
            <View style={styles.themeTitle}>
              <Text style={styles.themeTitleText}>最近新品</Text>
            </View>
            {this.state.products.length > 0 ? (
              <Products
                navigation={this.props.navigation}
                products={this.state.products}
              />
            ) : null}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    height: '100%'
  },
  scrollContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    display: 'flex'
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    color: '#989898',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50
  },
  footerItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  tabIcon: {
    width: 30,
    height: 30
  },
  activeTab: {
    color: 'rgb(171, 149, 109)'
  },
  themeBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-between'
  },
  themeTitle: {
    display: 'flex',
    height: 48,
    backgroundColor: 'rgb(255, 255, 255)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  themeTitleText: {
    color: 'rgb(171, 149, 109)',
    fontSize: 18
  },
  themeItem: {
    height: 160,
    width: '50%',
    borderColor: '#fff',
    borderBottomWidth: 2,
    borderRightWidth: 2
  },
  themeItemBig: {
    height: 160,
    flex: 0,
    width: '100%'
  },
  themeImage: {
    width: '100%',
    height: '100%'
  },
  fullHeight: {
    height: '100%'
  }
})
