import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/golbal.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'

Vue.prototype.axios=axios;
axios.defaults.baseURL=`http://127.0.0.1:8888/api/private/v1`
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})

Vue.use(ElementUI);
Vue.component('tree-table',TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
