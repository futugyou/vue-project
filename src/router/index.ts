import { createRouter, createWebHistory, Router, RouterHistory, RouteRecordRaw } from 'vue-router'

import { AwsRoutes } from './aws'
import { DemoRoutes } from './demo'

const routes = AwsRoutes.concat(DemoRoutes)

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
