import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'
const DashboardLayout = () => import(/* webpackChunkName: "dashboard" */ '../components/layout/dashboardLayout.vue')
const Login = () => import(/* webpackChunkName: "login" */ '../components/layout/loginLayout.vue')
const Logout = () => import(/* webpackChunkName: "logout" */ '../components/logout.vue')

function loadDashboard(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `../components/dashboard/${view}.vue`)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/',
        name: 'DashboardContent',
        component: loadDashboard('mainView')
      },
      {
        path: '/students',
        name: 'Students',
        component: loadDashboard('students')
      },
      {
        path: '/attendance',
        name: 'Attendance',
        component: loadDashboard('attendance')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth) && !store.state.isLoggedIn) {
    next({ name: 'Login' })
    return
  }
  if (to.name === 'Login' && store.state.isLoggedIn) {
    next({ name: 'DashboardContent' })
    return
  }
  if (to.name === 'DashboardContent' && !store.state.isLoggedIn) {
    next({ name: 'Login' })
    return
  }
  next()
})
export default router
