import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome'
import Users from '../components/users/Users.vue'
import Roles from '../components/power/Roles'
import Rights from '../components/power/Rights'
import Cate from '../components/shop/Cate'
import Goods from '../components/shop/Goods'
import Params from '../components/shop/Params'
import Orders from '../components/order/Orders'
import Add from '../components/shop/Add'
import Reports from '../components/report/Reports'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect:'/welcome',
      children:[
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/categories', component: Cate },
        { path: '/goods', component: Goods },
        { path: '/params', component: Params },
        { path: '/orders', component: Orders },
        { path: '/goods/add', component: Add },
        { path: '/reports', component: Reports }
      ]
    }

  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
