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
    return await AsyncStorage.getItem(key)
  }

  /**
   * 获取某项缓存的同步方法
   * @param {String} key 缓存的索引
   */
  getItemAsyc = key => {
    return AsyncStorage.getItem(key, function(err, result) {
      result
    })
  }

  /**
   * 设置缓存数据
   * @param {*} key 缓存索引
   * @param {*} value 缓存值
   */
  setItem = async (key, value) => {
    await AsyncStorage.setItem(key, value)
  }

  /**
   * 移除某项缓存
   * @param {*} key 缓存索引
   */
  removeItem = key => {
    AsyncStorage.removeItem(key)
  }
}

export default new Storage()
