import { AsyncStorage } from 'react-native'

export default class Storage {
  /**
   * 清楚所有缓存
   */
  clear() {
    AsyncStorage.clear()
  }

  /**
   * 获取某项缓存
   * @param {*} key 缓存索引
   */
  async getItem(key) {
    return await AsyncStorage.getItem(key)
  }

  /**
   * 设置缓存数据
   * @param {*} key 缓存索引
   * @param {*} value 缓存值
   */
  setItem(key, value) {
    AsyncStorage.setItem(key, value)
  }

  /**
   * 移除某项缓存
   * @param {*} key 缓存索引
   */
  removeItem(key) {
    AsyncStorage.removeItem(key)
  }
}
