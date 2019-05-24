import React, { Component } from 'react'

import {
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  StyleSheet
} from 'react-native'

export default class Loading extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: 5
    }
  }

  static timer

  componentDidMount() {
    timer = setInterval(() => {
      this.setState({
        time: this.state.time - 1
      })

      if (this.state.time <= 0) {
        this.handleJump()
      }
    }, 1000)
  }

  handleJump() {
    clearInterval(timer)
    this.props.navigation.navigate('App')
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.bgImg}
          source={require('../images/app/starts.png')}
        />

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.btn}
          onPress={() => this.handleJump()}
        >
          <Text style={styles.txt}>{this.state.time}S后跳过</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  bgImg: {
    width: '100%',
    height: '100%'
  },
  btn: {
    position: 'absolute',
    right: 36,
    bottom: 58,
    padding: 8,
    paddingLeft: 18,
    paddingRight: 18,
    borderRadius: 30,
    color: 'gray',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ebebeb'
  },
  txt: {
    fontSize: 16
  }
})
