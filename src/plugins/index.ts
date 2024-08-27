import type { App } from 'vue'

// Plugins
import CodeDiff from 'v-code-diff'

import { createAuthPlugin } from './auth'
import i18nPlugin from './i18n'
import vuetify from './vuetify'
import { usePinia } from '@/stores/plugins'
import { AuthService } from '@/tools/auth'
import { globalMessageKey } from '@/tools/injectkey'


const authService = new AuthService({} as any)// TODO: fill props

export function registerPlugins(app: App) {
    app.provide(globalMessageKey, 'hello!')

    const pinia = usePinia()
    app
        .use(createAuthPlugin(authService))
        .use(vuetify)
        .use(pinia)
        .use(i18nPlugin, {
            greetings: {
                hello: 'Bonjour!'
            }
        })
        .use(CodeDiff)
}
