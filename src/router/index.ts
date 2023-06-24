import Home from '../components/vuedemo/HelloWorld.vue'
import Base from '../components/vuedemo/Base.vue'
import FormComp from '../components/vuedemo/FormComp.vue'
import Dynamic from '../components/vuedemo/Dynamic.vue'
import BuiltIns from '../components/vuedemo/BuiltIns.vue'
import Reactivity from '../components/vuedemo/Reactivity.vue'
import RouteDemo from '../components/vuedemo/RouteDemo.vue'

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
  }
]

export default routes
