import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/golbal.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

// 导入并挂在树型表格插件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)

// 导入并挂在富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import vueQuillEditor from 'vue-quill-editor'
Vue.use(vueQuillEditor,/*{default global options}*/)

Vue.prototype.axios=axios;
axios.defaults.baseURL=`http://127.0.0.1:8888/api/private/v1`
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})

Vue.use(ElementUI);

Vue.config.productionTip = false

// 定义时间戳过滤器
Vue.filter('dataFormat',function(originVal){
  let time=new Date(originVal)
  let y=time.getFullYear();
  let m=(time.getMonth()+1+'').padStart(2,'0');
  let d=(time.getDate()+'').padStart(2,'0');
  let hh=(time.getHours()+'').padStart(2,'0');
  let mm=(time.getMinutes()+'').padStart(2,'0');
  let ss=(time.getSeconds()+'').padStart(2,'0');
  return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
