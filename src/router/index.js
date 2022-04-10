/*
 * @Author: your name
 * @Date: 2022-04-08 18:05:48
 * @LastEditTime: 2022-04-10 12:11:58
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue_shop\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Roles from '../components/power/Roles.vue'
import Rights from '../components/power/Rights.vue'
import Goods from '../components/goods/Goods.vue'
import Params from '../components/goods/Params.vue'
import Categories from '../components/goods/Categories.vue'
import Orders from '../components/order/Orders.vue'
import Reports from '../components/Reports.vue'
import Add from '../components/goods/Add.vue';
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},
// 配置登录组件
{
  path: '/login',
  component: Login
},
{
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  },
  {
    path: '/users',
    component: Users
  },
  {
    path: '/roles',
    component: Roles
  },
  {
    path: '/rights',
    component: Rights
  },
  {
    path: '/goods',
    component: Goods,
  },
  {
    path: '/params',
    component: Params
  },
  {
    path: '/categories',
    component: Categories
  },
  {
    path: '/orders',
    component: Orders
  },
  {
    path: '/reports',
    component: Reports
  },
  {
    path: '/goods/add',
    component: Add
  },
  ]
}
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 代表将要访问的路径
  // from 代表从哪个路径跳转过来
  // next 是一个函数代表放行, next() 直接放行 next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
