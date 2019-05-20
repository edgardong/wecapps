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