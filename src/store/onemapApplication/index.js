/*
 * @Description:一张图全局变量
 * @Author: your name
 * @Date: 2019-09-06 09:59:42
 */
import Vue from 'vue'
import Vuex from 'vuex'
import onemap from './onemap'
import spatialAnalysis from './spatialAnalysis'
import statisticalAnalysis from './statisticalAnalysis'
import HDL from './HDL'
import _ from 'lodash'
Vue.use(Vuex)

const onemapApplication = {
  namespaced: true,
  state: {
    executeMehod: null, // 执行的方法名称
    // 全局右侧面板
    rightPanelWidth: 0, // 宽度 单位为rem
    rightPanelShow: false,
    // 全局左侧面板
    leftPanelWidth: 0, // 宽度 单位为rem
    leftPanelShow: false,
    mapTypeVal: 'dzdtMap', // dzdtMap电子地图 yxMap影像图 3dMap三维
    locations: {}, //二维、三维地图当前位置，用于地图切换时候的联动
    initMapDone: false, // 地图是否初始化完成
    initMapCallBackArr: [] // 地图初始化完成后执行的方法队列
  },
  mutations: {
    setExecuteFunName(state, methodProxy) {
      state.executeMehod = methodProxy
    },
    setRightPanelWidth(state, width) {
      state.rightPanelWidth = width
    },
    setRightPanelShow(state, show) {
      state.rightPanelShow = show
    },
    setLeftPanelWidth(state, width) {
      state.leftPanelWidth = width
    },
    setLeftPanelShow(state, show) {
      state.leftPanelShow = show
    },
    setMapTypeVal(state, val) {
      state.mapTypeVal = val
    },
    setLocations(state, locations) {
      state.locations = locations
      // console.log('保存了store:' + state.locations)
    },
    setInitMapDone(state, val) {
      state.initMapDone = val
    },
    addInitMapCallBackArr(state, val) {
      state.initMapCallBackArr.push(val)
    }
  },
  actions: {},
  getters: {
    is3D(state) {
      return state.mapTypeVal === '3dMap'
    }
  }
}
_.merge(onemapApplication, onemap, spatialAnalysis, HDL, statisticalAnalysis)
export default onemapApplication
