import { ref, isRef, unref, watchEffect } from 'vue'
import type { Ref } from 'vue'

export const useFetch = (
    url: string | Ref<string>,
    mothed?: 'get' | 'post' | 'put' | 'delete',
    entity?: any
) => {
    mothed = mothed ?? 'get'
    const data: Ref<any> = ref<any>(null)
    const error: Ref<any> = ref<any>(null)
    const isReady = ref(false)
    const isLoading = ref(false)

    async function doFetch() {
        data.value = null
        error.value = null
        isReady.value = false
        isLoading.value = true

        const urlValue = unref(url)

        try {
            let res: Response
            if (entity) {
                res = await fetch(urlValue, {
                    method: mothed,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entity)
                })
            } else {
                res = await fetch(urlValue)
            }

            if (res.status == 401) {
                throw new Error('user not login or do not have right')
            }
            if (res.status == 404) {
                throw new Error('no data found')
            }
            if (!res.ok) {
                throw new Error(res.statusText)
            }

            data.value = await res.json()
            isReady.value = true
        } catch (e: any) {
            error.value = e
        }

        isLoading.value = false
    }

    if (isRef(url)) {
        watchEffect(doFetch)
    } else {
        doFetch()
    }

    return { data, error, isLoading, isReady }
}
