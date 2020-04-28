import request from '../utils/request'

/**
 * 通用查询
 *
 * @param {object} data
 * @returns {Promise}
 */

// 公共查询(规划)
function publicQuery(data) {
  return request({
    method: 'post',
    // url: window.queryUrl + '/',
    url: window.queryUrl + '/planQuery/',
    data: data
  })
}

//公共查询手动添加(规划)
function publicQueryHand(data) {
  return request({
    method: 'post',
    // url: window.queryUrl + '/getAllFieldName',
    url: window.queryUrl + '/planQuery/getAllFieldName',
    data: data
  })
}


//查询结果(规划)
function queryResult(data) {
  return request({
    method: 'post',
    // url: window.queryUrl + '/query',
    url: window.queryUrl + '/planQuery/query',
    data: data
  })
}


// 公共查询(地点)
function publicAddrQuery(data) {
  return request({
    method: 'post',
    // url: window.queryUrl + '/',
    url: window.queryUrl + '/locationQuery/',
    data: data
  })
}


//查询结果(地点)
function queryAddrResult(data) {
  return request({
    method: 'post',
    // url: window.queryUrl + '/query',
    url: window.queryUrl + '/locationQuery/query',
    data: data
  })
}


// 公共查询(专题)
function publicSpecialQuery(data) {
  return request({
    method: 'post',
    // url: window.queryUrl + '/',
    url: window.queryUrl + '/subjectQuery/',
    data: data
  })
}

//查询结果(专题)
function querySpelicResult(data) {
  return request({
    method: 'post',
    // url: window.queryUrl + '/query',
    url: window.queryUrl + '/subjectQuery/query',
    data: data
  })
}


//查询结果导出(规划)
function queryResultExport(data) {
  return request({
    method: 'post',
    // url: window.queryUrl + '/downloadResult',
    url: window.queryUrl + '/planQuery/downloadResult',
    data: data
  })
}


//查询结果导出(地点)
function queryAddrResultExport(data) {
  return request({
    method: 'post',
    // url: window.queryUrl + '/downloadResult',
    url: window.queryUrl + '/locationQuery/downloadResult',
    data: data
  })
}


export { publicQuery, publicQueryHand, queryResult, queryResultExport, publicAddrQuery, queryAddrResult, queryAddrResultExport, publicSpecialQuery, querySpelicResult }


