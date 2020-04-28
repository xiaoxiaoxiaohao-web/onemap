/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-06 09:59:42
 * @LastEditTime: 2019-09-06 09:59:42
 * @LastEditors: your name
 */
import Vue from 'vue'
import Vuex from 'vuex'

import onemapApplication from './onemapApplication'
import territorialPlanEvaluate from './territorialPlanEvaluate'
Vue.use(Vuex)

const global = {
  namespaced: true,
  state: {
    userinfo: {},
    routerPath: '', // 路由路径
    htmlFontSize: 0 // html的字号大小
  },
  getters: {
    userKey: state => {
      return state.userinfo.userKey
    }
  },
  mutations: {
    setUserInfo(state, userinfo) {
      state.userinfo = userinfo
    },
    setRouterPath(state, routerPath) {
      state.routerPath = routerPath
    },
    setHtmlFontSize(state, fontSize) {
      state.htmlFontSize = fontSize
    }
  }
}

export default new Vuex.Store({
  modules: {
    global,
    onemapApplication,
    territorialPlanEvaluate
  }
})
