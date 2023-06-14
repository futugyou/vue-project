import './public-path'

import { createApp, App as AppInstance } from 'vue'
import { createRouter, createWebHistory, Router, RouterHistory, RouterOptions } from 'vue-router'

import routes from './router'
import App from './App.vue'

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
    console.log('child-vue3 getData:', window.microApp.getData())
    window.microApp.addDataListener((data: Record<string, unknown>) => {
      console.log('child-vue3 addDataListener:', data)
      if (data.path && data.path !== router.currentRoute.value.path) {
        router.push(data.path as string)
      }
    })

    setTimeout(() => {
      window.microApp.dispatch({ myname: 'child-vue3' })
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
  app.use(router)
  app.mount('#app')

  console.log('micro app vue demo rendered')

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