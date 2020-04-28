import request from '../utils/request'
function postAllModulesRelation(data) {
  return request({
    method: 'post',
    // url: window.StatisticalAnalysisUrl + '/space/getAllModulesRelation',
    url: window.StatisticalAnalysisUrl + '/statistic/getAllModulesRelation',
    data: data
  })
}
export default {
  postAllModulesRelation
}
