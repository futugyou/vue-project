// composables/useIDBClient.ts
import { ref, shallowRef } from 'vue'
import { openDB } from 'idb'
import type { IDBPDatabase } from 'idb'
import { useLocalStorage, useSessionStorage } from '@vueuse/core'

interface IDBClient {
    setData: (key: string, value: any, storeName?: string) => Promise<void>
    getData: <T = any>(key: string, storeName?: string) => Promise<T | undefined>
    deleteData: (key: string, storeName?: string) => Promise<void>
    isReady: () => boolean
}

const clientCache = new Map<string, IDBClient>()

export const useIDBClient = (
    dbName: string,
    storeNames: string | string[],
    fallback: 'local' | 'session' = 'local'
): IDBClient => {
    const storeList = Array.isArray(storeNames) ? storeNames : [storeNames]
    const isSingleStore = storeList.length === 1
    const ready = ref(false)
    const fallbackStorage = shallowRef<Record<string, Record<string, any>>>({})
    let useFallback = false

    const cacheKey = `${dbName}/${storeList.join(',')}/${fallback}`
    if (clientCache.has(cacheKey)) {
        return clientCache.get(cacheKey)!
    }

    let dbPromise: Promise<IDBPDatabase> | null = null

    const init = async () => {
        try {
            dbPromise = openDB(dbName, 1, {
                upgrade(db) {
                    for (const store of storeList) {
                        if (!db.objectStoreNames.contains(store)) {
                            db.createObjectStore(store)
                        }
                    }
                },
            })
            await dbPromise
            ready.value = true
        } catch (e) {
            console.warn(`[useIDBClient] IndexedDB unavailable, using ${fallback}Storage instead.`, e)
            useFallback = true

            const storageKey = `fallback:${cacheKey}`
            const initData: Record<string, Record<string, any>> = {}
            for (const s of storeList) {
                initData[s] = {}
            }

            fallbackStorage.value =
                fallback === 'session'
                    ? useSessionStorage(storageKey, initData)
                    : useLocalStorage(storageKey, initData)

            ready.value = true
        }
    }

    // Fire-and-forget
    init()
    const resolveStore = (store?: string): string => {
        if (isSingleStore) return storeList[0]
        if (!store) throw new Error(`[useIDBClient] Must specify store name when using multiple stores`)
        if (!storeList.includes(store)) throw new Error(`[useIDBClient] Unknown store: ${store}`)
        return store
    }
    const client: IDBClient = {
        async setData(key: string, value: any, store?: string) {
            const s = resolveStore(store)
            if (useFallback) {
                fallbackStorage.value[s][key] = value
            } else {
                const db = await dbPromise!
                await db.put(s, value, key)
            }
        },
        async getData<T = any>(key: string, store?: string) {
            const s = resolveStore(store)
            if (useFallback) {
                return fallbackStorage.value[s][key] as T
            } else {
                const db = await dbPromise!
                return db.get(s, key)
            }
        },
        async deleteData(key: string, store?: string) {
            const s = resolveStore(store)
            if (useFallback) {
                delete fallbackStorage.value[s][key]
            } else {
                const db = await dbPromise!
                await db.delete(s, key)
            }
        },
        isReady() {
            return ready.value
        },
    }

    clientCache.set(cacheKey, client)
    return client
}

