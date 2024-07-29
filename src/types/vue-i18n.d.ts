// vue-i18n.d.ts
import { Pinia } from 'pinia'
import { StoreGeneric } from 'pinia'

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $translate: (key: string) => string
        $pinia: Pinia
        _pStores?: Record<string, StoreGeneric>
    }
}
