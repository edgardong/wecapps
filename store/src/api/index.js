import {
  get,
  post
} from '../utils/fetch'

/**
 * 获取首页轮播图数据
 * @param {*} id 
 */
export const getBanner = (id) => {
  return get('banner/' + id)
}

/**
 * 获取首页精选主题
 */
export const getTheme = () => {
  return get('theme?ids=1,2,3')
}

/**
 * 获取最新新品信息
 */
export const getProducts = () => {
  return get('product/recent')
}

/**
 * 获取产品详情
 * @param {*} id 产品ID
 */
export const getProductDetail = (id) => {
  return get('product/' + id)
}

/**
 * 获取商品分类
 */
export const getCategoryType = () => {
  return get('category/all')
}

/**
 * 获取制定分类下的所有商品
 * @param {*} id 分类ID
 */
export const getProductsByCategory = (id) => {
  return get('product/by_category?id=' + id)
}

/**
 * 用户登录接口
 * @param {Object} data: { username 用户名 ,password 密码}
 */
export const login = (data) => {
  return post('token/login', data)
}

/**
 * 用户注册接口
 * @param {Object} data: { username 用户名 ,password 密码}
 */
export const register = (data) => {
  return post('token/register', data)
}

/**
 * 获取主题下的产品
 * @param {*} id 主题ID
 */
export const getThemeProducts = id => {
  return get(`theme/${id}`)
}

/**
 * 获取用户地址信息
 */
export const getAddress = () => {
  return get(`address`)
}

/**
 * 创建用户订单
 * @param {*} data 
 */
export const createOrder = (data) => {
  return post(`order`, data)
}

/**
 * 用户预付款
 * @param {*} data 
 */
export const prePay = (data) => {
  return post(`pay/pre_order`, data)
}

/**
 * 上传用户日志
 * @param {*} data 
 */
export const uploadLog = (data) => {
  return post(`common/log`, data)
}

/**
 * 获取订单详情
 * @param {*} id 
 */
export const getOrderDetail = id => {
  return get(`order/${id}`)
}

/**
 * 获取我的订单
 * @param {Object} params 参数对象
 */
export const getMyOrders = params => {
  return get(`order/by_user`, params)
}