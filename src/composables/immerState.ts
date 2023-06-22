import immer from 'immer'
import { shallowRef } from 'vue'

export const useImmer = (baseState: any) => {
    const state = shallowRef(baseState)
    const update = (updater: any) => {
        state.value = immer.produce(state.value, updater)
    }

    return [state, update]
}