import React, { Component } from 'react'

import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated
} from 'react-native'

export default class Picker extends Component {
  constructor(props) {
    super(props)
  }

  handleCancel() {}

  handleSure() {}

  render() {
    let key = this.props.key
    return (
      <View style={styles.modal}>
        <ScrollView style={styles.scrollBox}>
          <View>
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
              <Text>确定</Text>
            </TouchableOpacity>
          </View>
          {this.props.dataSource.map((data, index) => (
            <View key={index}>
              <Text>{key ? data[key] : data}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  btnCancel: {},
  btnSure: {},
  modal: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 9999999
  },
  scrollBox: {
    position: 'absolute',
    height: 260,
    width: '100%',
    backgroundColor: 'green',
    bottom: 0,
    zIndex: 9
  }
})
