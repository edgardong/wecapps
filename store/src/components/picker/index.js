import React, { Component } from 'react'

import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  Animated
} from 'react-native'

export default class Picker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      needUpdate: true,
      currentIndex: props.index || 0,
      startY: 0, // 开始滚动距离
      scrollY: 0 // 滚动的距离
    }
  }

  update = false

  handleCancel() {
    this.update = true
    this.props.onCancel()
  }

  componentDidUpdate() {
    if (this.update && this.state.currentIndex !== this.props.index) {
      this.setState({
        currentIndex: this.props.index
      })
    }

    let _this = this
    if (this.refs.scrollBox && this.props.showModal && this.update) {
      setTimeout(() => {
        this.refs.scrollBox.scrollTo({
          x: 0,
          y: _this.props.index * 40
        })
        this.update = false
      }, 0)
    }
  }

  handleSure() {
    // console.log(this.props)
    let _this = this
    this.update = true
    this.props.onOk(
      _this.state.currentIndex,
      _this.props.dataSource[_this.state.currentIndex]
    )
  }

  // 开始滚动
  handleBeginScroll(e) {
    // console.log('handleBeginScroll', e.nativeEvent.contentOffset.y)
    this.setState({
      startY: 0
    })
  }

  // 滚动过程中
  handleScroll(e) {
    // console.log('handleScroll,', e.nativeEvent.contentOffset)
    // console.log('scrollContentSize', e.nativeEvent.contentSize.height)

    const scrollY = e.nativeEvent.contentOffset.y
    this.setState({
      scrollY
    })
  }

  // 滚动结束
  handleEndScroll(e) {
    // console.log('handleEndScroll', e.nativeEvent.contentOffset.y)
    const scrollY = this.state.scrollY

    // console.log(this.refs.scrollBox)
    let currentIndex = this.state.currentIndex

    // 计算滚动的格数
    let count = Math.floor(scrollY / 40)
    // console.log('移动的整体格数count', count)
    let offsetCount = scrollY - count * 40
    // console.log('移动的剩余距离', offsetCount)
    let scrollCount = count + (offsetCount >= 20 ? 1 : 0)
    // console.log('最终移动的格数', scrollCount)
    currentIndex = scrollCount
    // console.log('最终当前应该显示的是', currentIndex)

    this.setState({
      currentIndex
    })
    if (currentIndex >= this.props.dataSource.length - 1) {
      this.refs.scrollBox.scrollToEnd()
      return
    }
    this.refs.scrollBox.scrollTo({
      x: 0,
      y: currentIndex * 40
    })
  }

  render() {
    let key = this.props.key
    return (
      <View>
        <Modal
          visible={this.props.showModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modal}>
            <View style={styles.scrollBox}>
              <View style={styles.btns}>
                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={() => this.handleCancel()}
                >
                  <Text>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnSure}
                  onPress={() => this.handleSure()}
                >
                  <Text style={{ color: 'rgb(171, 149, 109)' }}>确定</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.centerView} />
              <ScrollView
                ref="scrollBox"
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={e => this.handleScroll(e)}
                onScrollBeginDrag={e => this.handleBeginScroll(e)}
                onScrollEndDrag={e => this.handleEndScroll(e)}
              >
                <View style={styles.fillArea} />
                {this.props.dataSource.map((data, index) => (
                  <View
                    key={index}
                    style={[
                      {
                        // translateY: 120 - this.state.currentIndex * 40
                      },
                      styles.item
                    ]}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        this.state.currentIndex == index
                          ? styles.activeText
                          : styles.nomalText
                      ]}
                    >
                      {key ? data[key] : data}
                    </Text>
                  </View>
                ))}
                <View style={styles.fillArea} />
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  btns: {
    fontSize: 18,
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebbe'
  },
  btnCancel: {},
  btnSure: {
    color: 'rgb(171, 149, 109)'
  },
  modal: {
    height:'100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1
  },
  scrollBox: {
    height: 320,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    flex: 1,
    backgroundColor: 'white'
  },
  scrollContent: {},
  centerView: {
    position: 'absolute',
    width: '100%',
    top: 160,
    zIndex: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    borderTopWidth: 1,
    borderTopColor: '#ebebeb'
  },
  item: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  itemText: {
    fontSize: 16,
    width: '100%',
    textAlign: 'center'
  },
  activeText: {
    color: 'rgb(171, 149, 109)',
    fontWeight: '500',
    fontSize: 18
  },
  nomalText: {},
  fillArea: {
    height: 120
  }
})
