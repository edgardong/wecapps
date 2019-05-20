import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { getCategoryType, getProductsByCategory } from '../api'

export default class Category extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      categorys: [],
      currentIndex: 0
    }
  }

  componentDidMount() {
    let _this = this
    getCategoryType().then(resp => {
      console.log(resp)
      _this.setState({
        categorys: resp
      })
    })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.leftBox}>
          {this.state.categorys.map(cate => (
            <TouchableOpacity key={cate.id} style={styles.cateItem} activeOpacity={0.9}>
              <Text style={styles.cateName}>{cate.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.rightBox} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    top: 0,
    display:'flex',
    backgroundColor: 'lightblue'
  },
  leftBox: {
    width: 70,
    height: '100%',
    borderRightColor: 'rgb(216, 216, 216)',
    borderRightWidth: 1
  },
  rightBox: {},
  cateItem: {
    height: 30,
    paddingTop: 10,
    paddingBottom: 10
  },
  cateName: {
    height: 30,
    textAlign: 'center'
  }
})
