import type { App } from 'vue'
import { validateDirective } from './validate'

export const registerDirectives = (app: App) => {
    app.directive('validate', validateDirective)
}
