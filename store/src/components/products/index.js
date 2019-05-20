import React, { Component } from 'react'
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native'

export default class Products extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log(this.props)
  }

  _onPressProduct(index) {
    this.props.navigation.navigate('Product', {
      id: this.props.products[index].id
    })
  }

  render() {
    return (
      <View style={styles.productWrapper}>
        {this.props.products.map((product, index) => (
          <TouchableOpacity
            activeOpacity={0.9}
            key={product.id}
            onPress={() => this._onPressProduct(index)}
            style={styles.productBox}
          >
            <Image
              style={styles.image}
              source={{
                uri: product.main_img_url
              }}
            />
            <Text style={styles.name}> {product.name} </Text>
            <Text style={styles.price}> ¥{product.price} </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  productWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  productBox: {
    width: '50%',
    height: 160,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderColor: '#fff',
    borderBottomWidth: 2,
    borderRightWidth: 2
  },
  image: {
    width: '80%',
    height: 100
  }
})
