/*
 * @Author: your name
 * @Date: 2022-04-08 18:05:48
 * @LastEditTime: 2022-04-10 11:21:17
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue_shop\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
// 引入tree-table插件
import TreeTable from 'vue-table-with-tree-grid'
// 引入图标库
import './assets/font-awesome-4.7.0/css/font-awesome.min.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
// 设置拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config);
  return config
})
Vue.config.productionTip = false

// 定义全局格式化时间的过滤器
Vue.filter('dataFormat', (originVal) => {
  const dt = new Date(originVal)

  // 获取四位年份
  const y = dt.getFullYear()
  // 获取月份，并将不足两位的前面补零
  const m = (dt.getMonth() + '').padStart(2, '0')
  // 获取月份
  const d = (dt.getDate() + '').padStart(2, '0')
  // 获取小时
  const hh = (dt.getHours() + '').padStart(2, '0')
  // 获取分钟
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  // 获取秒
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 注册全局插件
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册成为全局可用的组件
Vue.use(VueQuillEditor)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
