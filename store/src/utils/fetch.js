import {
  BaseRequestUrl
} from '../config'

let headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json;charset=utf-8',
  'source': 'android',
  'token': ''
}

/**
 * 执行fetch操作
 * @param {*} apiUrl 请求地址
 * @param {*} method 请求方法
 * @param {*} data 请求参数
 */
const myFetch = async (apiUrl, method, data) => {
  let param = {
    method,
    headers: headers
  }

  // console.log(data)
  if (method == 'GET') {
    apiUrl += covertObjToKeyValue(data)
  } else {
    param.body = JSON.stringify(data || {})
  }
  // console.log(param)
  let request = new Request(BaseRequestUrl + apiUrl, param)
  // console.log(request)
  const res = await fetch(request);
  // console.log(res)
  return res.json();
}

/**
 * get请求
 * @param {*} apiUrl 请求地址
 * @param {*} params 请求参数
 */
export function get(apiUrl, params) {
  return myFetch(apiUrl, 'GET', params)
}

/**
 * post请求
 * @param {*} apiUrl 请求地址
 * @param {*} data 请求参数
 */
export function post(apiUrl, data) {
  return myFetch(apiUrl, 'POST', data)
}

/**
 * 把请求对象改为?key=value&key=value形式
 * @param {*} params 请求参数
 */
const covertObjToKeyValue = (params) => {
  let paramString = ''
  if (params) {
    paramString += '?'
    params.keys.forEach(key => {
      paramString += `${key}=${value}&`
    });
  }
  return paramString
}