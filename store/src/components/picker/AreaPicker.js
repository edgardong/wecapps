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

export default class AreaPicker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      needUpdate: true,
      currentIndex: props.index[0] || 0,
      cityList: [],
      cityIndex: 0,
      countryList: [],
      countryIndex: 0,
      startY: 0, // 开始滚动距离
      scrollY: 0, // 滚动的距离,
      startCityY: 0, // 开始滚动距离
      scrollCityY: 0, // 滚动的距离,
      startCountryY: 0, // 开始滚动距离
      scrollCountryY: 0 // 滚动的距离,
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
    console.log('handleEndScroll,不应该停止滚动了饿么？')
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

    console.log('hahahahahh,', currentIndex)
    this.handleScrollContent(currentIndex)

    if (currentIndex >= this.props.dataSource.length - 1) {
      this.refs.scrollBox.scrollToEnd()
      return
    }
    this.refs.scrollBox.scrollTo({
      x: 0,
      y: currentIndex * 40
    })
  }

  // 开始滚动
  handleCityBeginScroll(e) {
    // console.log('handleBeginScroll', e.nativeEvent.contentOffset.y)
    this.setState({
      startCityY: 0
    })
  }

  // 滚动过程中
  handleCityScroll(e) {
    const scrollCityY = e.nativeEvent.contentOffset.y
    this.setState({
      scrollCityY
    })
  }

  // 滚动结束
  handleCityEndScroll(e) {
    console.log('handleEndScroll,不应该停止滚动了饿么？')
    const scrollY = this.state.scrollCityY

    // console.log(this.refs.scrollBox)
    let cityIndex = this.state.cityIndex

    // 计算滚动的格数
    let count = Math.floor(scrollY / 40)
    // console.log('移动的整体格数count', count)
    let offsetCount = scrollY - count * 40
    // console.log('移动的剩余距离', offsetCount)
    let scrollCount = count + (offsetCount >= 20 ? 1 : 0)
    // console.log('最终移动的格数', scrollCount)
    cityIndex = scrollCount
    // console.log('最终当前应该显示的是', currentIndex)

    console.log('hahahahahh,', cityIndex)
    let countryList = this.state.cityList[cityIndex].subList
    this.setState({
      countryList,
      cityIndex
    })

    if (cityIndex >= this.state.cityList.length - 1) {
      this.refs.cityScrollBox.scrollToEnd()
      return
    }
    this.refs.cityScrollBox.scrollTo({
      x: 0,
      y: cityIndex * 40
    })

    this.setState({
      countryIndex: 0
    })

    setTimeout(() => {
      // 市滚动到第一个
      this.refs.countryScrollBox.scrollTo({
        x: 0,
        y: 0 * 40
      })
    }, 0)
  }

  // 开始滚动
  handleCountryBeginScroll(e) {
    this.setState({
      startCountryY: 0
    })
  }

  // 滚动过程中
  handleCountryScroll(e) {
    const scrollCountryY = e.nativeEvent.contentOffset.y
    this.setState({
      scrollCountryY
    })
  }

  // 滚动结束
  handleCountryEndScroll(e) {
    const scrollY = this.state.scrollCountryY

    // console.log(this.refs.scrollBox)
    let countryIndex = this.state.countryIndex

    // 计算滚动的格数
    let count = Math.floor(scrollY / 40)
    // console.log('移动的整体格数count', count)
    let offsetCount = scrollY - count * 40
    // console.log('移动的剩余距离', offsetCount)
    let scrollCount = count + (offsetCount >= 20 ? 1 : 0)
    // console.log('最终移动的格数', scrollCount)
    countryIndex = scrollCount
    // console.log('最终当前应该显示的是', currentIndex)

    this.setState({
      countryIndex
    })

    if (countryIndex >= this.state.countryList.length - 1) {
      this.refs.countryScrollBox.scrollToEnd()
      return
    }
    this.refs.countryScrollBox.scrollTo({
      x: 0,
      y: countryIndex * 40
    })
  }

  /**
   * 省份滚动结束
   * @param {*} currentIndex 当前省份的索引
   */
  handleScrollContent(currentIndex) {
    let cityList = this.props.dataSource[currentIndex].subList
    let countryList = cityList[0].subList

    this.setState({
      currentIndex,
      cityList,
      countryList,
      cityIndex: 0,
      countryIndex: 0
    })

    setTimeout(() => {
      console.log(this.state)
      // 城市滚动到第一个
      this.handleCityScrollToTop(0)
    }, 50)
  }

  handleCityScrollToTop(index) {
    this.refs.cityScrollBox.scrollTo({
      x: 0,
      y: index * 40
    })

    setTimeout(() => {
      // 市滚动到第一个
      this.refs.countryScrollBox.scrollTo({
        x: 0,
        y: 0 * 40
      })
    }, 20)
  }

  render() {
    let key = this.props.key
    console.log('..走到这里来了？', this.props, this.state)
    if (this.props.dataSource) {
      if (this.state.cityList.length <= 0) {
        let currentIndex = 0
        let cityList = this.props.dataSource[currentIndex].subList
        let countryList = cityList[0].subList

        this.setState({
          currentIndex,
          cityList,
          countryList
        })
      }
    }

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
              {this.props.dataSource ? (
                <View style={{ width: '100%', flexDirection: 'row' }}>
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
                      <View key={index} style={[styles.item]}>
                        <Text
                          style={[
                            styles.itemText,
                            this.state.currentIndex == index
                              ? styles.activeText
                              : styles.nomalText
                          ]}
                        >
                          {key ? data[key] : data.areaName}
                        </Text>
                      </View>
                    ))}
                    <View style={styles.fillArea} />
                  </ScrollView>

                  <ScrollView
                    ref="cityScrollBox"
                    style={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    onScroll={e => this.handleCityScroll(e)}
                    onScrollBeginDrag={e => this.handleCityBeginScroll(e)}
                    onScrollEndDrag={e => this.handleCityEndScroll(e)}
                  >
                    <View style={styles.fillArea} />
                    {this.state.cityList.map((data, cityIndex) => (
                      <View
                        key={cityIndex}
                        style={[styles.item, styles.cityItem]}
                      >
                        <Text
                          style={[
                            styles.itemText,
                            this.state.cityIndex == cityIndex
                              ? styles.activeText
                              : styles.nomalText
                          ]}
                        >
                          {key ? data[key] : data.areaName}
                        </Text>
                      </View>
                    ))}
                    <View style={styles.fillArea} />
                  </ScrollView>

                  <ScrollView
                    ref="countryScrollBox"
                    style={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    onScroll={e => this.handleCountryScroll(e)}
                    onScrollBeginDrag={e => this.handleCountryBeginScroll(e)}
                    onScrollEndDrag={e => this.handleCountryEndScroll(e)}
                  >
                    <View style={styles.fillArea} />
                    {this.state.countryList.map((data, countryIndex) => (
                      <View key={countryIndex} style={[styles.item]}>
                        <Text
                          style={[
                            styles.itemText,
                            this.state.countryIndex == countryIndex
                              ? styles.activeText
                              : styles.nomalText
                          ]}
                        >
                          {key ? data[key] : data.areaName}
                        </Text>
                      </View>
                    ))}
                    <View style={styles.fillArea} />
                  </ScrollView>
                </View>
              ) : (
                <Text>暂无数据</Text>
              )}
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
    height: '100%',
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
  scrollContent: {
    width: '33%',
    flex: 1
  },
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
  cityItem: {},
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
