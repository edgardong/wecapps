import React, { Component } from 'react'
import { getBanner, getTheme, getProducts } from '../api'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ScrollView
} from 'react-native'
import Swiper from '../components/swiper'
import Products from '../components/products'
import Category from './Category'

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tabIndex: '0',
      titles: ['首页', '分类', '购物车', '我的'],
      banners: [],
      themes: [],
      products: []
    }
  }

  // static navigationOptions = {
  //   title: '首页',
  //   headerStyle: {
  //     backgroundColor: '#fff'
  //   },
  //   headerTintColor: 'black',
  //   headerTitleStyle: {
  //     fontWeight: 'bold'
  //   }
  // }

  // 设置顶部导航栏的相关样式
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state

    return {
      // title: '首页',
      title: params ? params.title : '首页',
      headerStyle: {
        backgroundColor: '#fff'
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
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
      console.log(resp)
      _this.setState({
        themes: resp
      })
    })

    getProducts().then(resp => {
      console.log(resp)
      _this.setState({
        products: resp
      })
    })
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

  render() {
    return (
      <View style={styles.container}>
        {/* {this.state.tabIndex == 0 ? ( */}
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* 顶部轮播图 */}
          <View>
            {this.state.banners.length > 0 ? (
              <Swiper items={this.state.banners} />
            ) : null}
          </View>

          {/* 精选主题区域 */}
          <View>
            <View style={styles.themeTitle}>
              <Text style={styles.themeTitleText}>精选主题</Text>
            </View>
            <View style={styles.themeBox}>
              {this.state.themes.map((theme, index) => (
                <View
                  key={theme.id}
                  style={index == 2 ? styles.themeItemBig : styles.themeItem}
                >
                  <Image
                    style={styles.themeImage}
                    source={{ uri: theme.topic_img.url }}
                    key={theme.id}
                  />
                </View>
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
        {/*  ) : null} */}

        {/* {this.state.tabIndex == 1 ? (
          <Category navigation={this.props.navigation} />
        ) : null} */}

        {/* 底部导航栏部分 */}
        {/* <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.footerItem}
            onPress={() => this.handleTabChange('0')}
          >
            <Image
              style={styles.tabIcon}
              source={
                this.state.tabIndex != 0
                  ? require('../images/toolbar/home.png')
                  : require('../images/toolbar/homeselected.png')
              }
            />
            <Text
              style={{
                color:
                  this.state.tabIndex != '0' ? '#989898' : 'rgb(171, 149, 109)'
              }}
            >
              主页
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.footerItem}
            onPress={() => this.handleTabChange('1')}
          >
            <Image
              style={styles.tabIcon}
              source={
                this.state.tabIndex != 1
                  ? require('../images/toolbar/category.png')
                  : require('../images/toolbar/categoryselected.png')
              }
            />
            <Text
              style={{
                color:
                  this.state.tabIndex != '1' ? '#989898' : 'rgb(171, 149, 109)'
              }}
            >
              分类
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.footerItem}
            onPress={() => this.handleTabChange('2')}
          >
            <Image
              style={styles.tabIcon}
              source={
                this.state.tabIndex != 2
                  ? require('../images/toolbar/cart.png')
                  : require('../images/toolbar/cartselected.png')
              }
            />
            <Text
              style={{
                color:
                  this.state.tabIndex != '2' ? '#989898' : 'rgb(171, 149, 109)'
              }}
            >
              购物车
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.footerItem}
            onPress={() => this.handleTabChange('3')}
          >
            <Image
              style={styles.tabIcon}
              source={
                this.state.tabIndex != '3'
                  ? require('../images/toolbar/my.png')
                  : require('../images/toolbar/myselected.png')
              }
            />
            <Text
              style={{
                color:
                  this.state.tabIndex != 3 ? '#989898' : 'rgb(171, 149, 109)'
              }}
            >
              我的
            </Text>
          </TouchableOpacity>
        </View> */}
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
