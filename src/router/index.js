import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/user/Users.vue'
import Rights from '../views/powers/Rights.vue'
import Roles from '../views/powers/Roles.vue'
import Categories from '../views/goods/Categories.vue'
import Params from '../views/goods/Params.vue'
import List from '../views/goods/List.vue'
import Add from '../views/goods/Add.vue'

Vue.use(VueRouter)

const routes = [
 {
   path:'/',
   redirect:'/login'
 },
 {
   path:'/login',
   name:'Login',
   component:Login
 },
 {
  path:'/home',
  name:'Home',
  component:Home,
  redirect:'/welcome',
  children:[
    {
      path:'/welcome',
      component:Welcome
    },
    {
      path:'/users',
      component:Users,
      meta:['用户管理','用户列表']
    },
    {
      path:'/rights',
      component:Rights,
      meta:['权限管理','权限列表']
    },
    {
      path:'/roles',
      component:Roles,
      meta:['权限管理','角色列表']
    },
    {
      path:'/categories',
      component:Categories,
      meta:['商品管理','商品分类']
    },
    {
      path:'/params',
      component:Params,
      meta:['商品管理','分类参数']
    },
    {
      path:'/goods',
      component:List,
      meta:['商品管理','分类参数']
    },
    {
      path:'/goods/add',
      component:Add,
      meta:['商品管理','添加商品']
    },
  ]
}
]

const router = new VueRouter({
  routes
})
//挂在路由导航守卫
// 参数分别为：to   要跳转到的页面
          // from   从哪个页面跳转
          // next   判断后执行的回调函数，其中的参数表示将跳转到的页面
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next();
  let token=window.sessionStorage.getItem('token');
  if(!token) return next('/login');
  next();
})

export default router
