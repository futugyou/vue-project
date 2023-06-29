import { createRouter, createWebHistory, Router, RouterHistory } from 'vue-router'

const Home = () => import('../components/vuedemo/HelloWorld.vue')
const Base = () => import('../components/vuedemo/Base.vue')
const FormComp = () => import('../components/vuedemo/FormComp.vue')
const Dynamic = () => import('../components/vuedemo/Dynamic.vue')
const BuiltIns = () => import('../components/vuedemo/BuiltIns.vue')
const Reactivity = () => import('../components/vuedemo/Reactivity.vue')
const RouteDemo = () => import('../components/vuedemo/RouteDemo.vue')
const PiniaDemo = () => import('../components/vuedemo/PiniaDemo.vue')

const removeQueryParams = (to: any) => {
  if (Object.keys(to.query).length) return { path: to.path, query: {}, hash: to.hash }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { transition: 'slide-left' }
  },
  {
    path: '/base',
    name: 'Base',
    component: Base
  },
  {
    path: '/pinia',
    name: 'Pinia',
    component: PiniaDemo
  },
  {
    path: '/form',
    name: 'Form',
    component: FormComp,
    meta: { transition: 'slide-right' }
  },
  {
    path: '/dynamic',
    name: 'Dynamic',
    component: Dynamic
  },
  {
    path: '/built-ins',
    name: 'Built-ins',
    component: BuiltIns
  },
  {
    path: '/reactivity',
    name: 'Reactivity',
    component: Reactivity
  },
  // {
  //   path: '/route:username(.*)',
  //   name: 'Route',
  //   component: RouteDemo
  // },
  {
    path: '/route/:username*',
    name: 'Route',
    component: RouteDemo
  },
  {
    path: '/redirect/:username*',
    name: 'Redirect',
    redirect: {
      name: 'Route'
    }
  },
  {
    // /search/screens -> /route?q=screens
    path: '/search/:searchText',
    redirect: (to: any) => {
      // 方法接收目标路由作为参数
      // return 重定向的字符串路径/路径对象
      return { path: '/route', query: { q: to.params.searchText } }
    }
  },
  {
    path: '/route2/:username*',
    beforeEnter: [removeQueryParams],
    name: 'Route2',
    component: RouteDemo,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  }
]

let router: Router | null = null
let history: RouterHistory | null = null
history = createWebHistory(window.__MICRO_APP_BASE_ROUTE__ || import.meta.env.BASE_URL)
router = createRouter({
  history,
  routes
}) as Router

// route guards
router.beforeEach((to: any, from: any) => {
  // it will NOT stop redirect
  if (to.name == 'Redirect') {
    return false
  }

  if (to.meta.requiresAuth) {
    if (window.__MICRO_APP_ENVIRONMENT__) {
      const data = window.microApp?.getData()
      if (!data?.Authorization) {
        window.microApp.dispatch({
          NeedLogin: true,
          CreateAt: Date()
        })
      }
    } else {
      return {
        // this is fake
        path: '/login',
        query: { redirect: to.fullPath }
      }
    }
  }
})

const clearRouter = () => {
  history?.destroy()
  router = null
  history = null
}

export { router, clearRouter }
