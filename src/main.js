/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-06 09:59:42
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import { registerPlugins } from './plugins'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
// 注册自定义插件
registerPlugins(Vue)

// elment-ui
Vue.use(Element, {
  size: 'small' // set element-ui default size
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
