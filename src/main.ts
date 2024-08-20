import './assets/main.css'
import 'the-new-css-reset/css/reset.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import { HoneycombSDK } from './tools/honeycomb'
HoneycombSDK.start()

import { createApp, App as AppInstance } from 'vue'

import { inject } from '@vercel/analytics'
import CodeDiff from 'v-code-diff'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, md } from 'vuetify/iconsets/md'
import { md3 } from 'vuetify/blueprints'

import App from './App.vue'
import { router, clearRouter } from './router'
import { globalMessageKey } from './tools/injectkey'
import { usePinia } from './stores/plugins'
import i18nPlugin from './plugins/i18n'

import { handleMicroData } from '@/tools/baseAppEvent'

let app: AppInstance | null = null

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'light',
    },
    blueprint: md3,
    components,
    directives,
    icons: {
        defaultSet: 'md',
        aliases,
        sets: {
            md,
        },
    },
    defaults: {
        VTextField: { density: "compact", hideDetails: true },
        VBtn: { variant: 'outlined', density: "comfortable" },
        VSelect: { variant: 'outlined', density: "compact", centerAffix: true, hideDetails: true },
        VCheckbox: { density: "compact", color: "red", hideDetails: true },
        VTable: { density: "comfortable" },
    },
})

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
