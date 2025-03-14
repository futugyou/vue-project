import './assets/main.css'
import 'the-new-css-reset/css/reset.css'

import { HoneycombSDK } from './tools/honeycomb'
HoneycombSDK.start()

import { createApp } from 'vue'
import type { App as AppInstance } from 'vue'
import { inject } from '@vercel/analytics'

import { router, clearRouter } from './router'
import { handleMicroData } from '@/tools/baseAppEvent'
import { registerPlugins } from './plugins'
import { registerDirectives } from './directives'
// @ts-ignore
import App from './App.vue'

let app: AppInstance | null = null

const mount = () => {
    app = createApp(App)
    app.use(router!)
    
    registerPlugins(app)
    registerDirectives(app)

    app.mount('#vue3-app-main')
    console.log(3, 'micro app vue demo rendered')

    handleMicroData(router!)
    inject()
}

const unmount = () => {
    app?.unmount()
    clearRouter(() => {
        app = null
    })

    console.log('micro app vue demo unmounted')
}

if (window.__MICRO_APP_ENVIRONMENT__) {
    // @ts-ignore
    window[`micro-app-${window.__MICRO_APP_NAME__}`] = { mount, unmount }
} else {
    mount()
}
