import { ref, isRef, unref, watchEffect, Ref } from 'vue'

export const useFetch = (url: string | Ref<string>, mothed?: 'get', entity?: null) => {
    mothed = mothed ?? 'get'
    const data = ref<any>(null)
    const error = ref<any>(null)

    async function doFetch() {
        data.value = null
        error.value = null

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
        } catch (e: any) {
            error.value = e
        }
    }

    if (isRef(url)) {
        watchEffect(doFetch)
    } else {
        doFetch()
    }

    return { data, error }
}
