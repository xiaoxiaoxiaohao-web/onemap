/*
 *@description: 第三方库挂载到vue实例上的插件
 *@author: 谭新
 *@date: 2019/10/08 16:42
 *@note:
*/
import _ from 'lodash'
export default {
  install(Vue) {
    Vue.prototype._ = _
  }
}
