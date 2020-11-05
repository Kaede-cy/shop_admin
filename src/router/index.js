import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/user/Users.vue'

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
      component:Users
    }
  ]
}
]

const router = new VueRouter({
  routes
})
//挂在路由导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next();
  let token=window.sessionStorage.getItem('token');
  if(!token) return next('/login');
  next();
})

export default router
