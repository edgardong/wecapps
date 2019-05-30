import AsyncStorage from '@react-native-community/async-storage'

class Storage {
  /**
   * 清楚所有缓存
   */
  clear = () => {
    AsyncStorage.clear()
  }

  /**
   * 获取某项缓存
   * @param {*} key 缓存索引
   */
  getItem = async key => {
    let data = await AsyncStorage.getItem(key)
    console.log('data', data)
    console.log('getItems.....', typeof data)
    let result;
    try {
      result = JSON.parse(data)
    } catch (error) {
      result = data
    }
    console.log('result', result)
    return result;
  }

  /**
   * 获取某项缓存的同步方法
   * @param {String} key 缓存的索引
   */
  getItemAsyc = key => {
    return AsyncStorage.getItem(key, function (err, result) {
      result
    })
  }

  /**
   * 设置缓存数据
   * @param {*} key 缓存索引
   * @param {*} value 缓存值
   */
  setItem = async (key, value) => {
    if (typeof value != 'string') {
      value = JSON.stringify(value)
    }
    return await AsyncStorage.setItem(key, value)
  }

  /**
   * 移除某项缓存
   * @param {*} key 缓存索引
   */
  removeItem = async key => {
    return await AsyncStorage.removeItem(key)
  }
}

export default new Storage()