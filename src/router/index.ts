import Home from '../components/vuedemo/HelloWorld.vue'
import Base from '../components/vuedemo/Base.vue'
import FormComp from '../components/vuedemo/FormComp.vue'
import Dynamic from '../components/vuedemo/Dynamic.vue'
import BuiltIns from '../components/vuedemo/BuiltIns.vue'
import Reactivity from '../components/vuedemo/Reactivity.vue'
import RouteDemo from '../components/vuedemo/RouteDemo.vue' 

const removeQueryParams = (to: any) => {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/base',
    name: 'Base',
    component: Base
  },
  {
    path: '/form',
    name: 'Form',
    component: FormComp
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
