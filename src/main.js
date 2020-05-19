import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//  导入全局样式
import './assets/css/global.less'
//  导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'
//  导入表格插件
import ZkTable from 'vue-table-with-tree-grid'
//  导入富文本组件
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(ZkTable)
Vue.use(VueQuillEditor)
//  配置请求基准url
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//  添加到vue原型上
Vue.prototype.$http = axios
// 设置请求拦截器, 为了在服务器请求之前设置头部信息的token值
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
