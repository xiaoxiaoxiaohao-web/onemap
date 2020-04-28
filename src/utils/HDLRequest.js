/*
 * @Description: 核地类工具接口
 * @Author: your name
 * @Date: 2019-06-27 17:43:01
 */
import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import { Message } from 'element-ui'
import store from '@/store'

let isDebugging = () => localStorage.debug === 'true'

// create axios instance
const request = axios.create({
  // baseURL: process.env.VUE_APP_BASE_URL, // base url
  baseURL: window.HDLBaseUrl
  //withCredentials: true // wether send cookie when crossing origin
  // headers: {
  //   'Accept': 'application/json',
  //   'Content-Type': 'application/json'
  // }
})

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
      switch (error.response.status) {
        case 401:
          Message.error('身份验证失败，请重新登录')
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
