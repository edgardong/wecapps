import React from 'react'

import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native'

export default class Address extends React.Component {
  constructor(props) {
    super(props)
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: '地址编辑'
    }
  }

  render() {
    return <View style={styles.container} />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
