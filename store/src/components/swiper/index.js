import React, { Component } from 'react'
import { View, StyleSheet, Image, ImageBackground } from 'react-native'

export default class Swiper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 0
    }
  }

  static interval = 0

  componentDidMount() {
    console.log('this.props........', this.props)

    interval = setInterval(() => {
      let nextIndex = this.state.active + 1
      if (nextIndex >= this.props.items.length) {
        nextIndex = 0
      }
      this.setState({
        active: nextIndex
      })
    }, 5000)
  }

  componentWillUnmount() {
    clearInterval(interval)
  }

  render() {
    return (
      <View style={styles.swiperBox}>
        {/* 轮播图图片区域 */}
        {this.props.items.map((item, index) => (
          <View
            key={item.key_word}
            style={[
              styles.swiperItem,
              this.state.active == index ? styles.active : styles.nomal
            ]}
          >
            <Image
              style={styles.image}
              source={{
                uri: item.img.url
              }}
            />
          </View>
        ))}

        {/* 轮播图指示点 */}
        <View style={styles.indicatBox}>
          {this.props.items.map((item, index) => (
            <View
              key={item.key_word}
              style={[
                styles.swiperIndicat,
                this.state.active == index
                  ? styles.activeIndicat
                  : styles.nomalIndicat
              ]}
            />
          ))}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  swiperBox: {
    display: 'flex',
    flexDirection: 'row'
  },
  swiperItem: {
    width: '100%',
    flex: 0
  },
  image: {
    width: '100%',
    height: 200,
    maxWidth: '100%'
  },
  nomal: {
    display: 'none'
  },
  active: {},
  indicatBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 6,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  swiperIndicat: {
    width: 12,
    height: 12,
    borderRadius: 12,
    marginLeft: 10
  },
  nomalIndicat: {
    backgroundColor: '#888'
  },
  activeIndicat: {
    backgroundColor: '#fff'
  }
})
