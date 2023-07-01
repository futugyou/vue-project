import { ref } from 'vue'
import { createGlobalState, useStorage } from '@vueuse/core'

export const useTabStore = createGlobalState(() => useStorage('vueuse-tab-index', 0))
