import React, { Component } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

export default class Base extends Component {
  constructor(props) {
    super(props)
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state

    return {
      // title: '首页',
      title: params ? params.title : '首页',
      headerStyle: {
        backgroundColor: '#fff'
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }
  }
}

export {
  React,
  Component,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet
}
