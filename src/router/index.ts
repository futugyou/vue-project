import Home from '../components/HelloWorld.vue'
import Base from '../components/Base.vue'
import FormComp from '../components/FormComp.vue'
import Dynamic from '../components/Dynamic.vue'

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
  }
]

export default routes
