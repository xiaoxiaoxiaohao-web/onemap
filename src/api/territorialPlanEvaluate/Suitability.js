/*
 * @Description: 双评价--国土空间开发与适宜性评价
 */
import request from '@/utils/request'

// 农业生产适宜性评价--获取说明内容
function getExplainByArea(params) {
  return request({
    method: 'get',
    url: 'evaluation/suitability/getExplainByArea',
    params
  })
}
// 获取中山市所有镇区列表
function getabuttalData(params) {
  return request({
    method: 'get',
    url: 'http://172.26.40.108:8099/region/townData',
    params
  })
}

//评价成果
function evaluationResults(params) {
  return request({
    method: 'get',
    url: 'http://172.26.40.108:8099/landResources/achievementData',
    params
  })
}


export default {
  getExplainByArea,
  getabuttalData,
  evaluationResults
}
