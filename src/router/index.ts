// webpackChunkName is use for webpack, but i dot not want use it in this project
const Home = () => import(/* webpackChunkName: "base-vue-demo" */ '../components/vuedemo/HelloWorld.vue')
const Base = () => import(/* webpackChunkName: "base-vue-demo" */ '../components/vuedemo/Base.vue')
const FormComp = () => import(/* webpackChunkName: "base-vue-demo" */ '../components/vuedemo/FormComp.vue')
const Dynamic = () => import(/* webpackChunkName: "base-vue-demo" */ '../components/vuedemo/Dynamic.vue')
const BuiltIns = () => import(/* webpackChunkName: "base-vue-demo" */ '../components/vuedemo/BuiltIns.vue')
const Reactivity = () => import(/* webpackChunkName: "base-vue-demo" */ '../components/vuedemo/Reactivity.vue')
const RouteDemo = () => import(/* webpackChunkName: "base-vue-demo" */ '../components/vuedemo/RouteDemo.vue') 

const removeQueryParams = (to: any) => {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { transition: 'slide-left' },
  },
  {
    path: '/base',
    name: 'Base',
    component: Base
  },
  {
    path: '/form',
    name: 'Form',
    component: FormComp,
    meta: { transition: 'slide-right' },
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
    },
  },
  {
    path: '/route2/:username*',
    beforeEnter: [removeQueryParams],
    name: 'Route2',
    component: RouteDemo,
    meta: { requiresAuth: true }
  }
]

export default routes
