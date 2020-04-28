/*
 * @Description: 核地类接口
 * @Author: ljl
 * @Date: 2019-08-23 20:04:28
 */
import request from '../utils/HDLRequest'
/**
 * 导出地类核准意见
 *
 *
 * @returns {Promise}
 */
function exportResultExcel(params) {
  return request({
    method: 'post',
    url: '/checkmap/exportResultExcel',
    data: params
  })
}
/**
 * 导出用地会审呈批表
 *
 *
 * @returns {Promise}
 */
function postExportExamineExcel(params) {
  return request({
    method: 'post',
    url: '/checkmap/exportExamineExcel',
    data: params
  })
}
/**
 * 导出执法核查地类证明
 *
 *
 * @returns {Promise}
 */
function postExportProveExcel(params) {
  return request({
    method: 'post',
    url: '/checkmap/exportProveExcel',
    data: params
  })
}
/**
 * 文件下载
 *
 *
 * @returns {Promise}
 */
function downloadfileFun(params) {
  return request({
    method: 'get',
    url: '/checkmap/downloadfile',
    // 返回格式、解决文件乱码问题
    responseType: 'blob',
    params
  })
}


/**
 * 获取单年份核查不审核数据
 *
 *
 * @returns {Promise}
 */
function getLandTypeData(params) {
  return request({
    method: 'post',
    url: '/gis/landType',
    data: params
  })
}
/**
 * 获取单年份核查审核数据
 *
 *
 * @returns {Promise}
 */
function getLandTypeAndLineData(params) {
  return request({
    method: 'post',
    url: 'gis/landTypeAndLine',
    data: params
  })
}
/**
 * 1.获取图层服务地址列表
 *
 *
 * @returns {Promise}
 */
function getLandLineListData() {
  return request({
    method: 'get',
    url: '/landline/getLandLineList'
  })
}
/**
 *2. 获取单年服务地址
 *
 *
 * @returns {Promise}
 */
function getLandLineData(params) {
  return request({
    method: 'get',
    url: '/landline/getLandLine',
    params
  })
}
/**
 * 3.获取追溯不审核建设用地范围
 *
 *
 * @returns {Promise}
 */
function postYearLandTypeData(params) {
  return request({
    method: 'post',
    url: '/landline/yearLandType',
    data: params
  })
}
/**
 * 4.获取追溯审核建设用地、线状地物范围
 *
 *
 * @returns {Promise}
 */
function postYearLandLineTypeData(params) {
  return request({
    method: 'post',
    url: '/landline/yearLandLineType',
    data: params
  })
}
/**
 * 5.获取地类图斑追溯非建设用地年份
 *
 *
 * @returns {Promise}
 */
function postLandbeforeYearData(params) {
  return request({
    method: 'post',
    url: '/landline/landbeforeYear',
    data: params
  })
}
/**
 * 6.获取线状地物追溯非建设用地年份
 *
 *
 * @returns {Promise}
 */
function postlinebeforeYearData(params) {
  return request({
    method: 'post',
    url: '/landline/linebeforeYear',
    data: params
  })
}

// 导入文件
function importFile(data) {
  return request({
    method: 'post',
    url: window.HDLBaseUrl + '/checkmap/uploadshp',
    data: data,
    noQs: true
  })
}
export default {
  exportResultExcel,
  postExportExamineExcel,
  postExportProveExcel,
  downloadfileFun,
  getLandTypeData,
  getLandTypeAndLineData,
  getLandLineListData,
  getLandLineData,
  postYearLandTypeData,
  postYearLandLineTypeData,
  postLandbeforeYearData,
  postlinebeforeYearData,
  importFile
}
