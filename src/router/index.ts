import { createRouter, createWebHistory, Router, RouterHistory, RouteRecordRaw } from 'vue-router'

import { AwsRoutes } from './aws'
import { DemoRoutes } from './demo'
import { ToolsRoutes } from './tools'
import { handleRequiresAuth } from '@/tools/baseAppEvent'

const routes = AwsRoutes.concat(DemoRoutes).concat(ToolsRoutes)

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

    handleRequiresAuth()
})

const clearRouter = (fn: () => void) => {
    history?.destroy()
    fn()
    router = null
    history = null
}

export { router, clearRouter }
