import React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { getCategoryType, getProductsByCategory } from '../api'
import Products from '../components/products'

export default class Category extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      categorys: [],
      currentIndex: 0,
      products: []
    }
  }

  // 左侧类别改变后操作
  handleTabChange(id, index) {
    this.setState({
      currentIndex: index
    })
    this.getProducts(id)
  }

  // 获取指定类型的商品
  getProducts(id) {
    let _this = this
    getProductsByCategory(id).then(res => {
      console.log('product', res)
      _this.setState({
        products: res
      })
    })
  }

  componentDidMount() {
    let _this = this
    getCategoryType().then(resp => {
      console.log('...', resp)
      _this.setState({
        categorys: resp
      })
      _this.getProducts(resp[0].id)
    })
  }

  render() {
    let state = this.state
    return (
      <View style={styles.container}>
        {/* 左侧分类 */}
        <ScrollView style={styles.leftBox} showsVerticalScrollIndicator={false}>
          {this.state.categorys.map((cate, index) => (
            <TouchableOpacity
              key={cate.id}
              style={styles.cateItem}
              activeOpacity={0.9}
              onPress={() => this.handleTabChange(cate.id, index)}
            >
              <Text
                style={
                  this.state.currentIndex == index
                    ? styles.activeCate
                    : styles.cateName
                }
              >
                {cate.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 右侧部分 */}
        <View style={styles.rightBox}>
          {/* 顶部大图 */}

          {state.categorys.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image
                style={styles.rightTopImg}
                source={{ uri: state.categorys[state.currentIndex].img.url }}
              />
              <Products
                navigation={this.props.navigation}
                products={state.products}
              />
            </ScrollView>
          ) : null}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    flex: 1
  },
  leftBox: {
    width: 30,
    // flex:1,
    display: 'flex',
    flexDirection: 'column',
    borderRightColor: 'rgb(216, 216, 216)',
    borderRightWidth: 1,
    color: 'rgb(171, 149, 109)'
  },
  rightBox: {
    flex: 4,
    padding: 20
  },
  cateItem: {
    // height: 30,
    paddingTop: 10,
    paddingBottom: 10
  },
  cateName: {
    height: 30,
    lineHeight: 30,
    fontSize: 14,
    textAlign: 'center',
    color: 'rgb(152,152,152)'
  },
  activeCate: {
    height: 30,
    lineHeight: 30,
    fontSize: 14,
    textAlign: 'center',
    color: 'rgb(171, 149, 109)',
    borderLeftColor: 'rgb(171, 149, 109)',
    borderLeftWidth: 3
  },
  rightTopImg: {
    height: 100
  }
})
