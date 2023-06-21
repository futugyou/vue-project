import { Ref } from 'vue'
import type { InjectionKey } from 'vue'

export const globalMessageKey = Symbol() as InjectionKey<string>
export const messageKey = Symbol() as InjectionKey<Ref<string>>
export const locationKey = Symbol() as InjectionKey<LocationInject>
export const i18nKey = Symbol() as InjectionKey<I18nInject>

interface LocationInject {
    location: Ref<string>
    updateLocation: () => void
}

export interface I18nInject {
    greetings: {[key: string]: string}
}