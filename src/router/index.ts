import Home from '../components/HelloWorld.vue'
import Count from '../components/Count.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/count',
    name: 'Count',
    component: Count
  } 
]

export default routes
