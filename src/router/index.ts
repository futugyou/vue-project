import { createRouter, createWebHistory, Router, RouterHistory, RouteRecordRaw } from 'vue-router'

import { AwsRoutes } from './aws'
import { DemoRoutes } from './demo'
import { ToolsRoutes } from './tools'
import { GitlakRoutes } from './gitlak'
import { handleRequiresAuth } from '@/tools/baseAppEvent'

const routes = AwsRoutes.concat(DemoRoutes).concat(ToolsRoutes).concat(GitlakRoutes)

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
        handleRequiresAuth()
    }
})

const clearRouter = (fn: () => void) => {
    history?.destroy()
    fn()
    router = null
    history = null
}

export { router, clearRouter }
