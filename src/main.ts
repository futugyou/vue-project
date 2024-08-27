import './assets/main.css'
import 'the-new-css-reset/css/reset.css'

import { HoneycombSDK } from './tools/honeycomb'
HoneycombSDK.start()

import { createApp, App as AppInstance } from 'vue'

import { inject } from '@vercel/analytics'
import CodeDiff from 'v-code-diff'

import App from './App.vue'
import { router, clearRouter } from './router'
import { usePinia } from './stores/plugins'
import i18nPlugin from './plugins/i18n'

import { handleMicroData } from '@/tools/baseAppEvent'
import { globalMessageKey } from '@/tools/injectkey'
import vuetify from '@/tools/vuetify'
import { AuthService } from './tools/auth'
import { createAuthPlugin } from './plugins/auth'

let app: AppInstance | null = null

const authService = new AuthService({} as any)// TODO: fill props

const mount = () => {
    // @ts-ignore
    const pinia = usePinia()
    app = createApp(App)
    app.use(createAuthPlugin(authService))
    app.use(pinia)
    app.provide(globalMessageKey, 'hello!')
    app.use(i18nPlugin, {
        greetings: {
            hello: 'Bonjour!'
        }
    })

    app.use(router!)
    app.use(CodeDiff)
    app.use(vuetify)

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
