import Vue from 'vue'
import Router from 'vue-router'
// import Login from '../components/login/login.vue'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Rights from '@/components/rights/rights.vue'
import Role from '@/components/rights/role.vue'
import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: "/login",
      component: Login
    },
    {
      name: 'home',
      path: "/",
      component: Home,
      children: [
        { name: 'users', path: '/users', component: Users },
        { name: 'rights', path: '/rights', component: Rights },
        { name: 'roles', path: '/roles', component: Role }
      ]
    }
  ]
})


router.beforeEach((to, from, next) => {
  // 如果要去的是登录 -> next()
  if (to.path === '/login') {
    next()
  } else {
    // 如果要去的不是登录
    const token = localStorage.getItem("token");
    if (!token) {
      Message.warning('请先登录')
      router.push({ path: '/login' })
      return
    } 
    next()
  }
})

export default router