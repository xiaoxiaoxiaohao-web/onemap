/*
 * @Description: 空间分析接口API
 */
import request from '../utils/request'

// 获取所有分析模型
function postAllModulesRelation(data) {
  return request({
    method: 'post',
    url: window.SpatialAnalysisUrl + '/space/getAllModulesRelation',
    data: data
  })
}

// 执行分析
function postAnalyze(data) {
  return request({
    method: 'post',
    url: window.SpatialAnalysisUrl + '/space/analyze',
    data: data
  })
}

// 导出文件
function exportResult(data) {
  return request({
    method: 'post',
    url: window.SpatialAnalysisUrl + '/space/exportResult',
    data: data,
    responseType: 'blob'
  })
}

// 导入文件
function importFile(data) {
  return request({
    method: 'post',
    url: window.SpatialAnalysisUrl + '/space/getGeometryData',
    data: data,
    noQs: true
  })
}

export default {
  postAllModulesRelation,
  postAnalyze,
  exportResult,
  importFile
}
