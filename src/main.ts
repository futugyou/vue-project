import './public-path'

import { createApp, App as AppInstance } from 'vue'
import { createRouter, createWebHistory, Router, RouterHistory, RouterOptions } from 'vue-router'

import routes from './router'
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
    console.log(4,'vueawsapp getData:', window.microApp.getData())
    window.microApp.addDataListener((data: Record<string, unknown>) => {
      console.log(6,'vueawsapp addDataListener:', data)
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
let router: Router | null = null
let history: RouterHistory | null = null

function mount() {
  history = createWebHistory(window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL)
  router = createRouter({
    history,
    routes,
  }) as Router

  // @ts-ignore
  app = createApp(App)
  app.provide(globalMessageKey, 'hello!')
  app.use(i18nPlugin, {
    greetings: {
      hello: 'Bonjour!'
    }
  })
  app.use(router)
  app.mount('#vu3-app-main')

  console.log(3, 'micro app vue demo rendered')

  handleMicroData(router)

}

function unmount() {
  app?.unmount()
  history?.destroy()
  app = null
  router = null
  history = null
  console.log('micro app vue demo unmounted')
}

if (window.__MICRO_APP_ENVIRONMENT__) {
  // @ts-ignore
  window[`micro-app-${window.__MICRO_APP_NAME__}`] = { mount, unmount }
} else {
  mount()
}