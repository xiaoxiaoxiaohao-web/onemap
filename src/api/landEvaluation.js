/*
 * @Description: 国土分析评价接口
 * @Author: xzw
 * @Date: 2019-10-14 14:04:28
 */
import axios from 'axios'
//查询服务获取grapihc
function getRing(data) {
  let url = 'url' + data
  axios.get(url).then((res) => {
    return res
  })
}

export default {
  getRing
}
