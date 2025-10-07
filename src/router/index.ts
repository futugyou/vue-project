import { createRouter, createWebHistory } from 'vue-router'
import type { Router, RouterHistory } from 'vue-router'

import { AwsRoutes } from './aws'
import { DemoRoutes } from './demo'
import { ProjectRoutes } from './project'
import { ToolsRoutes } from './tools'
import { handleRequiresAuth } from '@/tools/baseAppEvent'

const routes = AwsRoutes.concat(DemoRoutes).concat(ToolsRoutes).concat(ProjectRoutes)

let router: Router | null = null
let history: RouterHistory | null = null
let baseUrl = import.meta.env.BASE_URL
if (window.__MICRO_APP_ENVIRONMENT__) {
    if (window.__MICRO_APP_BASE_ROUTE__) {
        baseUrl = window.__MICRO_APP_BASE_ROUTE__
    } else {
        baseUrl = "/vue"
    }
} else {
    const path = window.location.pathname;
    baseUrl = path.startsWith('/vue') ? '/vue/' : '/';
    document.querySelector('#vue-app-base')?.setAttribute('href', baseUrl);
}

console.log('href is:', window.location.href, 'base url is:', baseUrl)

const patchWindowOpenWithRouter = (router: Router) => {
    const rawOpen = window.open

    window.open = function (url, target, features) {
        if (url === undefined || url instanceof URL) {
            return rawOpen.call(window, url, target ?? '_blank', features)
        }

        if (url.startsWith('http://') || url.startsWith('https://')) {
            return rawOpen.call(window, url, target ?? '_blank', features)
        }

        if (window.__MICRO_APP_ENVIRONMENT__) {
            let origin = location.origin.replace(/\/+$/, '')
            let path = location.pathname.replace(/^\/+/, '')

            let finalUrl = origin + '/' + path + '?' + path + '=' + url

            console.log('window open url is:', finalUrl);

            return rawOpen.call(window, finalUrl, target ?? '_blank', features)
        } else {
            return rawOpen.call(window, url, target ?? '_blank', features)
        }
    }
}

history = createWebHistory(baseUrl)
router = createRouter({
    history,
    routes
}) as Router

patchWindowOpenWithRouter(router)

// route guards
router.beforeEach((to: any, from: any, next: any) => {
    // it will NOT stop redirect
    if (to.name == 'Redirect') {
        return false
    }

    if (to.meta.requiresAuth && !handleRequiresAuth()) {
        next(false)
    } else {
        next()
    }
})

const clearRouter = (fn: () => void) => {
    history?.destroy()
    fn()
    router = null
    history = null
}
export { router, clearRouter, patchWindowOpenWithRouter }
