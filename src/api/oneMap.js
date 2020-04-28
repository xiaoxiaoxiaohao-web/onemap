/*
 * @Description: 一张图接口API
 * @Author: your name
 * @Date: 2019-09-06 15:27:43
 */
import request from '../utils/request'

/**
 * 获取地图服务图层树数据
 *
 * @returns {Promise}
 */
function getServiceResourceTreeData() {
  return request({
    method: 'get',
    url: '/map/getServiceResourceTree'
  })
}
/**
 * 获取地图服务专题数据
 *
 * @returns {Promise}
 */
function getFeatureInfoList(data) {
  return request({
    method: 'post',
    url: '/user/getFeatureInfoList',
    data
  })
}
function postFeatureLayers(data) {
  return request({
    method: 'post',
    url: '/user/postRelayinfos',
    data
  })
}
/**
 * 前端页面配置
 *
 * @returns {Promise}
 */
function postJsonfromxmlData(params) {
  return request({
    method: 'post',
    url: '/configutils/getjsonfromxml',
    data: params
  })
}

function getjsonfromxml(data) {
  return request({
    method: 'post',
    url: 'http://172.26.40.108:8099/configutils/getjsonfromxml',
    data
  })
}

function queryArcGis(url) {
  return request({
    method: 'get',
    url: url
  })
}

export default {
  getServiceResourceTreeData,
  getFeatureInfoList,
  postFeatureLayers,
  postJsonfromxmlData,
  getjsonfromxml,
  queryArcGis
}
