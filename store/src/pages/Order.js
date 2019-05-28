import React from 'react'
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native'
import { getAddress } from '../api'
export default class Order extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: null
    }
  }

  componentDidMount() {
    console.log('....order.....')
    getAddress().then(resp => {
      console.log('address', resp)
      this.setState({
        address: resp
      })
    })
  }

  /**
   * 导航栏设置
   */
  static navigationOptions = ({ navigition }) => {
    return {
      title: '订单详情'
    }
  }

  render() {
    const address = this.state.address
    return (
      <View style={styles.container}>
        {address ? (
          <View style={styles.addressBox}>
            <View style={styles.leftBox}>
              <View style={styles.topContent}>
                <View style={[styles.user, styles.dirRow]}>
                  <Image
                    style={styles.smallImg}
                    source={require('../images/icon/user.png')}
                  />
                  <Text>{address.name}</Text>
                </View>
                <View style={[styles.mobile, styles.dirRow]}>
                  <Image
                    style={styles.smallImg}
                    source={require('../images/icon/mobile.png')}
                  />
                  <Text>{address.mobile}</Text>
                </View>
              </View>
              <View style={styles.bottomContent}>
                <Text>{`${address.province}${address.city}${address.country}${
                  address.detail
                }`}</Text>
              </View>
            </View>
            <View style={styles.rightArrow}>
              <Image
                source={require('../images/icon/arrowright.png')}
                style={styles.rightArrowImg}
              />
            </View>
          </View>
        ) : null}
        <ScrollView />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  },
  addressBox: {
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff'
  },
  smallImg: {
    width: 16,
    height: 16,
    marginRight: 5
  },
  dirRow: {
    flexDirection: 'row'
  },
  topContent: {
    flexDirection: 'row',
    marginBottom: 13,
    justifyContent: 'space-between'
  },
  leftBox: {
    flex: 1
  },
  rightArrow: {
    width: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})
