import React from 'react'
import { View, ScrollView, Image, StyleSheet } from 'react-native'
import Products from '../components/products'
import { getThemeProducts } from '../api'

export default class Theme extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      products: null
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.title
    }
  }

  componentWillMount() {
    const id = this.props.navigation.getParam('id')
    getThemeProducts(id).then(resp => {
      this.setState({
        products: resp
      })
    })
  }

  render() {
    return (
      <View>
        {this.state.products ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              style={styles.topImg}
              source={{ uri: this.state.products.head_img.url }}
            />
            <Products
              navigation={this.props.navigation}
              products={this.state.products.products}
            />
          </ScrollView>
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topImg: {
    width: '100%',
    height: 200,
    marginBottom: 15
  }
})
