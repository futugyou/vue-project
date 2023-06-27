import './public-path'

import { createApp, App as AppInstance, watch } from 'vue'
import { Router } from 'vue-router'
import { createPinia } from 'pinia'

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

const handleMicroData = (router: Router) => {
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

const mount = () => {
  // @ts-ignore
  const pinia = createPinia()
  // store is built using the setup syntax and does not implement $reset().
  pinia.use(({ store }) => {
    const initialState = JSON.parse(JSON.stringify(store.$state));
    store.$reset = () => {
      store.$state = JSON.parse(JSON.stringify(initialState));
    }
  })

  watch(
    pinia.state,
    (state) => {
      for (const key in state) {
        const value = state[key];
        localStorage.setItem('global_' + key, JSON.stringify(value))
      }
    },
    { deep: true }
  )

  app = createApp(App)
  app.use(pinia)
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

const unmount = () => {
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