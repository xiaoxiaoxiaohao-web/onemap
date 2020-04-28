import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getUserInfo, getUserSecretKey } from '@/api/userApi'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

function hasUserKey() {
  return store.getters['global/userKey']
}

function registerRouterHook(router) {
  router.beforeEach(async (to, from, next) => {
    // 记录路由
    store.commit('global/setRouterPath', to.path)
    NProgress.start()

    const hasKey = hasUserKey()
    if (hasKey) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done()
      } else {
        next()
      }
    } else {
      if (to.path === '/login') {
        next()
      } else {
        const result = await validateUser()
        if (result.userinfo) {
          store.commit('global/setUserInfo', result.userinfo)
          next()
        } else {
          // Message.error(result.errmsg)
          router.replace('/login')
          // next()
        }
      }
      NProgress.done()
    }
  })
  router.afterEach((to, from, next) => {
    NProgress.done()
  })
}

async function validateUser() {
  const result = {
    userinfo: null,
    errmsg: ''
  }
  try {
    const userResult = await getUserInfo()
    if (userResult.Data) {
      const userinfo = userResult.Data
      const keyResult = await getUserSecretKey()
      if (keyResult.Data) {
        userinfo.userKey = keyResult.Data
        result.userinfo = userinfo
        // store.commit('global/setUserInfo', userinfo)
      } else {
        //Message.error('验证身份信息失败，请登录')
        result.errmsg = '验证身份信息失败，请重新登录'
      }
    } else {
      // this.$router.replace('/login')
      result.errmsg = '验证身份信息失败，请重新登录'
    }
  } catch {
    result.errmsg = '获取身份信息失败，请登录'
  }
  return result
}


export default registerRouterHook
