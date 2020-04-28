import request from '../utils/request'

/**
 * 通用登陆
 *
 * @param {object} data
 * @returns {Promise}
 */
function login(data) {
  return request({
    method: 'post',
    url: '/common/login',
    data: data
  })
}
// function login(data) {
//   return request({
//     method: 'post',
//     url: 'http://172.26.40.108:8769/toonemap/apigateway/common/login',
//     data: data
//   })
// }

function logout(data) {
  return request({
    method: 'post',
    url: '/common/logout',
    data
  })
}

function getUserInfo(params) {
  return request({
    method: 'get',
    url: '/user/getUserInfo',
    params
  })
}

function getUserSecretKey(params) {
  return request({
    method: 'get',
    url: '/user/getSecret',
    params
  })
}

export { login, logout, getUserInfo, getUserSecretKey }
