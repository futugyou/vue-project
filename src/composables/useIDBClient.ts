// composables/useIDBClient.ts
import { ref, shallowRef } from 'vue'
import { openDB } from 'idb'
import type { IDBPDatabase } from 'idb'
import { useLocalStorage, useSessionStorage } from '@vueuse/core'

interface IDBClient {
    setData: (key: string, value: any) => Promise<void>
    getData: <T = any>(key: string) => Promise<T | undefined>
    deleteData: (key: string) => Promise<void>
    isReady: () => boolean
}

const clientCache = new Map<string, IDBClient>()

/**
 * @deprecated Use composables/useIDBClientEx.ts
 */
export const useIDBClient = (
    dbName: string,
    storeName: string,
    fallback: 'local' | 'session' = 'local'
): IDBClient => {
    const ready = ref(false)
    const fallbackStorage = shallowRef<Record<string, any>>({})
    let useFallback = false

    const cacheKey = `${dbName}/${storeName}/${fallback}`
    if (clientCache.has(cacheKey)) {
        return clientCache.get(cacheKey)!
    }

    let dbPromise: Promise<IDBPDatabase> | null = null

    const init = async () => {
        try {
            dbPromise = openDB(dbName, 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName)
                    }
                },
            })
            await dbPromise
            ready.value = true
        } catch (e) {
            console.warn(`[useIDBClient] IndexedDB unavailable, using ${fallback}Storage instead.`, e)
            useFallback = true

            const storageKey = `fallback:${cacheKey}`
            fallbackStorage.value =
                fallback === 'session'
                    ? useSessionStorage<Record<string, any>>(storageKey, {})
                    : useLocalStorage<Record<string, any>>(storageKey, {})

            ready.value = true
        }
    }

    // Fire-and-forget
    init()

    const client: IDBClient = {
        async setData(key: string, value: any) {
            if (useFallback) {
                fallbackStorage.value[key] = value
            } else {
                const db = await dbPromise!
                await db.put(storeName, value, key)
            }
        },
        async getData<T = any>(key: string) {
            if (useFallback) {
                return fallbackStorage.value[key] as T
            } else {
                const db = await dbPromise!
                return db.get(storeName, key)
            }
        },
        isReady() {
            return ready.value
        },
        deleteData: async (key: string) => {
            if (useFallback) {
                delete fallbackStorage.value[key]
            } else {
                const db = await dbPromise!
                await db.delete(storeName, key)
            }
        },
    }

    clientCache.set(cacheKey, client)
    return client
}
