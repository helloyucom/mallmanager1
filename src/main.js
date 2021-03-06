// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import MyBread from '@/components/cuscom/MyBread.vue'
import router from './router'

/** element-ui */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 不要忘记引入css文件
import '@/assets/css/reset.css'

// axios以前的写法，现在想Vue.use这种形式使用
/* import axios from 'axios'
Vue.proototype.$http = axios; */

import MyServerHttp from '@/plugins/http.js'
Vue.use(MyServerHttp)

// moment
import moment from 'moment'

// 全局过滤器
Vue.filter('fmtDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

// 全局组件
Vue.component(MyBread.name, MyBread)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
