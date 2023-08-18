import './assets/styles.scss'
import './assets/main.css'
import '@popperjs/core'
import 'bootstrap'

import { createApp, App as AppInstance } from 'vue'
import { Router } from 'vue-router'

import App from './App.vue'
import { router, clearRouter } from './router'
import { globalMessageKey } from './tools/injectkey'
import { usePinia } from './stores/plugins'
import i18nPlugin from './plugins/i18n'

import { handleMicroData } from '@/tools/baseAppEvent' 

let app: AppInstance | null = null

const mount = () => {
    // @ts-ignore
    const pinia = usePinia()
    app = createApp(App)
    app.use(pinia)
    app.provide(globalMessageKey, 'hello!')
    app.use(i18nPlugin, {
        greetings: {
            hello: 'Bonjour!'
        }
    })

    app.use(router!)

    app.mount('#vu3-app-main')
    console.log(3, 'micro app vue demo rendered')

    handleMicroData(router!)
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
