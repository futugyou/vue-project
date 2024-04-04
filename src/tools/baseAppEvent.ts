
import { Router } from 'vue-router'

declare global {
    interface Window {
        microApp: any
        __MICRO_APP_NAME__: string
        __MICRO_APP_ENVIRONMENT__: string
        __MICRO_APP_BASE_ROUTE__: string
        rawWindow: any
    }
}

export const handleGlobalData = () => {
    if (window.__MICRO_APP_ENVIRONMENT__) {
        window.microApp.setGlobalData({ name: window.__MICRO_APP_NAME__ })
    }
}

export const handleMicroData = (router: Router) => {
    if (window.__MICRO_APP_ENVIRONMENT__) {
        console.log(4, 'vueawsapp getData:', window.microApp.getData())
        window.microApp.addDataListener((data: Record<string, unknown>) => {
            console.log(6, 'vueawsapp addDataListener:', data)
            if (data.path && data.path !== router.currentRoute.value.path) {
                router.push(data.path as string)
            }
        })

        setTimeout(() => {
            window.microApp.dispatch({ myname: 'vueawsapp' })
        }, 3000)
    }
}

export const handleRequiresAuth = () => {
    if (window.__MICRO_APP_ENVIRONMENT__) {
        const data = window.microApp?.getData()
        if (!data?.Authorization) {
            window.microApp.dispatch({
                NeedLogin: true,
                CreateAt: Date()
            })
        }
    } else {
        // return {
        //     // this is fake
        //     path: '/login',
        //     query: { redirect: to.fullPath }
        // }
    }
} 
