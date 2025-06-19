// composables/useIDBClient.ts
import { ref, shallowRef } from 'vue'
import { openDB } from 'idb'
import type { IDBPDatabase } from 'idb'
import { useLocalStorage, useSessionStorage } from '@vueuse/core'

type FallbackType = 'local' | 'session'

interface BasicStoreClient {
    setData: (key: string, value: any) => Promise<void>
    getData: <T = any>(key: string) => Promise<T | undefined>
    deleteData: (key: string) => Promise<void>
}

export interface IDBClient {
    setData: (key: string, value: any, storeName?: string) => Promise<void>
    getData: <T = any>(key: string, storeName?: string) => Promise<T | undefined>
    deleteData: (key: string, storeName?: string) => Promise<void>
    isReady: () => boolean

    /** use when using multiple storeNames */
    getClientFor: (storeName: string) => BasicStoreClient
}

const clientCache = new Map<string, IDBClient>()

export const useIDBClient = (
    dbName: string,
    storeNames: string | string[],
    fallback: FallbackType = 'local'
): IDBClient => {
    const stores = Array.isArray(storeNames) ? storeNames : [storeNames]
    const isSingleStore = stores.length === 1
    const ready = ref(false)
    let useFallback = false

    const fallbackStorageMap = shallowRef(new Map<string, Record<string, any>>())

    const cacheKey = `${dbName}/${stores.join(',')}/${fallback}`
    if (clientCache.has(cacheKey)) {
        return clientCache.get(cacheKey)!
    }

    let dbPromise: Promise<IDBPDatabase> | null = null

    const init = async () => {
        try {
            dbPromise = openDB(dbName, 1, {
                upgrade(db) {
                    for (const store of stores) {
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

            for (const store of stores) {
                const storageKey = `fallback:${dbName}/${store}/${fallback}`
                const fallbackStore =
                    fallback === 'session'
                        ? useSessionStorage<Record<string, any>>(storageKey, {})
                        : useLocalStorage<Record<string, any>>(storageKey, {})
                fallbackStorageMap.value.set(store, fallbackStore.value)
            }

            ready.value = true
        }
    }

    // Fire-and-forget init
    init()

    const resolveStore = (storeName?: string): string => {
        if (isSingleStore) return stores[0]
        if (!storeName) throw new Error(`[useIDBClient] Must specify store name when using multiple stores`)
        if (!stores.includes(storeName)) throw new Error(`[useIDBClient] Invalid store name: ${storeName}`)
        return storeName
    }

    const client: IDBClient = {
        async setData(key: string, value: any, storeName?: string) {
            const store = resolveStore(storeName)
            if (useFallback) {
                fallbackStorageMap.value.get(store)![key] = value
            } else {
                const db = await dbPromise!
                await db.put(store, value, key)
            }
        },

        async getData<T = any>(key: string, storeName?: string) {
            const store = resolveStore(storeName)
            if (useFallback) {
                return fallbackStorageMap.value.get(store)![key] as T
            } else {
                const db = await dbPromise!
                return db.get(store, key)
            }
        },

        async deleteData(key: string, storeName?: string) {
            const store = resolveStore(storeName)
            if (useFallback) {
                delete fallbackStorageMap.value.get(store)![key]
            } else {
                const db = await dbPromise!
                await db.delete(store, key)
            }
        },

        isReady() {
            return ready.value
        },
        getClientFor: (storeName: string): BasicStoreClient => {
            // if isSingleStore, no matter what you use, it will return the default
            const resolved = resolveStore(storeName)
            return {
                async setData(key, value) {
                    return client.setData(key, value, resolved)
                },
                async getData<T = any>(key: string) {
                    return client.getData<T>(key, resolved)
                },
                async deleteData(key) {
                    return client.deleteData(key, resolved)
                },
            }
        }
    }

    clientCache.set(cacheKey, client)
    return client
}
