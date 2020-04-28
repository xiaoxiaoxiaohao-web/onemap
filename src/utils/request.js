/*
 * @Description: 请求方法
 * @Author: your name
 * @Date: 2019-09-06 09:59:42
 */
import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import { Message } from 'element-ui'
import store from '@/store'

// 请求信息输出开关 localStorage.debug = 'true'
const isDebugging = () => localStorage.debug === 'true'
let time = ''

// create axios instance
const request = axios.create({
  baseURL: window.baseUrl, // base url
  withCredentials: true, // 是否允许带cookie这些
  timeout: 20000
})

// request interceptor
request.interceptors.request.use(
  config => {
    // post方法，用qs转换参数
    if (config.data && !config.noQs) {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
request.interceptors.response.use(
  response => {
    const res = response.data
    if (isDebugging()) {
      const config = response.config
      const url = config.url
      console.log(
        `%c${url}\n%c${JSON.stringify(res)}`,
        'color:blue',
        'color:green'
      )
    }
    if (response.status !== 200) {
      return Promise.reject(new Error('error'))
    } else {
      return res
    }
  },
  error => {
    if (isDebugging()) {
      const config = error.config
      const url = config.url
      console.log(
        `%c${url}\n%c${error}`,
        'color:blue',
        'color:red'
      )
    }
    if (error.response) {
      clearTimeout(time)
      switch (error.response.status) {
        case 401:
          time = setTimeout(() => {
            if (window.sessionStorage.type === 'login') {
              Message.error('身份验证过期，请重新登录')
            } else {
              Message.error('身份验证失败，请重新登录')
            }
          }, 200)
          // 清空保存的身份信息
          store.commit('global/setUserInfo', {})
          router.replace('/login')
          break
        default:
          break
      }
    }
    return Promise.reject(error)
  }
)

export default request
