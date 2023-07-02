import { RouteRecordRaw } from 'vue-router'

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

export const DemoRoutes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { transition: 'slide-fade' }
  },
  {
    path: '/base',
    name: 'Base',
    component: Base,
    meta: { transition: 'list' }
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
    meta: { transition: 'bounce' }
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
  }
] as RouteRecordRaw[]
