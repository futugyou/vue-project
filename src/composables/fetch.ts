import { ref, isRef, unref, watchEffect } from 'vue'

export const useFetch = (url: any) => {
  const data = ref<any>(null)
  const error = ref<any>(null)

  async function doFetch() {
    data.value = null
    error.value = null

    const urlValue = unref(url)

    try {
      const res = await fetch(urlValue)
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
