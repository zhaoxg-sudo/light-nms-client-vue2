// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import dataV from '@jiaminghi/data-view'
// 导入JQ
// import $ from 'jquery'
// 导入excel
import JsonExcel from 'vue-json-excel'
import VueSocketio from 'vue-socket.io'
// 引入element ui tree css
import 'element-ui/lib/theme-chalk/index.css'
// 缺少这行，所有 el-icon- 都会消失
import 'element-ui/lib/theme-chalk/icon.css'
// 引入bootstrap css
import './assets/css/bootstrap.css'
// 引入 font-awesome
import './assets/css/font-awesome.css'
// 引入公用 css
import './assets/css/default.css'
// 引入播放条样式
import './assets/css/loaderskit.css'
// 引入系统设置样式
import './assets/css/setting.css'
// 引入公用 js
import './assets/js/common.js'
// import 'utils/public'
// 1.滚动条
// import './assets/js/jquery.slimscroll.min'
// 2.动态高度
// import './assets/js/effect.js'
// 导入全局地址
import { APP_HOST } from './hosts'
// 挂载全局，所有页面直接 this.$appHost 使用
Vue.prototype.$appHost = APP_HOST
Vue.use(dataV)
Vue.use(ElementUI)
// 全局设置消息弹窗最高层级
// ElementUI.Message.defaults.zIndex = 100000
// web socket
Vue.use(new VueSocketio({
  debug: false,
  connection: APP_HOST
}))
Vue.prototype.$ajax = axios
Vue.component('downloadExcel', JsonExcel)
// enable vue tools
Vue.config.devtools = false

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  sockets: {
    connect: function () {
      console.log('websocket has connected++++++++++++++++++++++++++++++++++++\n')
    },
    disconnect () {
      // ✅ 断开输出
      console.log('❌ websocket 断开连接')
    }
  },
  render: h => h(App)
}).$mount('#app')
