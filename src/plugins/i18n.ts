import { i18nKey } from '../tools/injectkey'

export default {
    install: (app: any, options: any) => {
        app.config.globalProperties.$translate = (key: string) => {
            return key.split('.').reduce((o, i) => {
                if (o) return o[i]
            }, options)
        }

        app.provide(i18nKey, options)
    }
}
