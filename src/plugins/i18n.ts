import { i18nKey } from '../tools/injectkey'

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}

export default {
  install: (app: any, options: any) => {
    // 注入一个全局可用的 $translate() 方法
    app.config.globalProperties.$translate = (key: string) => {
      // 获取 `options` 对象的深层属性
      // 使用 `key` 作为索引
      console.log(options)
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }

    app.provide(i18nKey, options)
  }
}
