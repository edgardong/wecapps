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
      showModal: true
    }
  }

  handleCancel() {
    this.setState({
      showModal: false
    })
  }

  handleSure() {
    this.setState({
      showModal: false
    })
  }

  render() {
    let key = this.props.key
    return (
      <View>
        <Modal
          visible={this.state.showModal}
          transparent={false}
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
              <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {this.props.dataSource.map((data, index) => (
                  <View key={index} style={styles.item}>
                    <Text style={styles.itemText}>
                      {key ? data[key] : data}
                    </Text>
                  </View>
                ))}
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
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1
  },
  scrollBox: {
    height: 240,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    flex: 1,
    backgroundColor: 'white'
  },
  scrollContent: {},
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
  }
})
