import './public-path'

import { createApp, App as AppInstance } from 'vue'
import { Router } from 'vue-router'

import { router, clearRouter } from './router'
import App from './App.vue'
import i18nPlugin from './plugins/i18n'

import { globalMessageKey } from './tools/injectkey'

declare global {
  interface Window {
    microApp: any
    __MICRO_APP_NAME__: string
    __MICRO_APP_ENVIRONMENT__: string
    __MICRO_APP_BASE_ROUTE__: string
  }
}

function handleMicroData(router: Router) {
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

let app: AppInstance | null = null

function mount() {
  // @ts-ignore
  app = createApp(App)
  app.provide(globalMessageKey, 'hello!')
  app.use(i18nPlugin, {
    greetings: {
      hello: 'Bonjour!'
    }
  })

  if (router) {
    app.use(router)
  }

  app.mount('#vu3-app-main')
  console.log(3, 'micro app vue demo rendered')

  if (router) {
    handleMicroData(router)
  }
}

function unmount() {
  app?.unmount()
  app = null
  clearRouter()

  console.log('micro app vue demo unmounted')
}

if (window.__MICRO_APP_ENVIRONMENT__) {
  // @ts-ignore
  window[`micro-app-${window.__MICRO_APP_NAME__}`] = { mount, unmount }
} else {
  mount()
}