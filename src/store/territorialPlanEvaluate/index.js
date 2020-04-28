/*
 * @Description:国土空间规划分析评价
 * @Author: your name
 * @Date: 2019年10月9日14:47:02
 */
import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import Suitability from './Suitability'
Vue.use(Vuex)

const territorialPlanEvaluate = {
  namespaced: true,
  state: {
    executeMehod: null, // 执行的方法名称
    // 全局右侧面板
    rightPanelWidth: 0, // 宽度 单位为rem
    rightPanelShow: false,
    // 全局左侧面板
    leftPanelWidth: 0, // 宽度 单位为rem
    leftPanelShow: false
  },
  mutations: {
    // SpatialAnalysis分屏执行的方法名称
    setExecuteFunName(state, methodProxy) {
      state.executeMehod = methodProxy
    },
    setRightPanelWidth(state, width) {
      state.rightPanelWidth = width
      console.log('地图右侧：' + width)
    },
    setRightPanelShow(state, show) {
      state.rightPanelShow = show
    },
    setLeftPanelWidth(state, width) {
      state.leftPanelWidth = width
    },
    setLeftPanelShow(state, show) {
      state.leftPanelShow = show
    }
  },
  actions: {}
}
_.merge(territorialPlanEvaluate, Suitability)
export default territorialPlanEvaluate
