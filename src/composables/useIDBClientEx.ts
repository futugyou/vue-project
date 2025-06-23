// composables/useIDBClient.ts
import { ref, shallowRef } from 'vue'
import { openDB } from 'idb'
import type { IDBPDatabase } from 'idb'
import { useLocalStorage, useSessionStorage } from '@vueuse/core'

type FallbackType = 'local' | 'session'

/**
 * Basic client interface for a single IndexedDB object store.
 */
export interface BasicStoreClient {
    setData: (key: string, value: any) => Promise<void>
    getData: <T = any>(key: string) => Promise<T | undefined>
    deleteData: (key: string) => Promise<void>
}

/**
 * The main IDB client interface, supporting single or multiple stores.
 */
export interface IDBClient {
    /**
     * Sets data in a specified store. If only one store is configured, `storeName` is optional.
     * @param key The key to store the data under.
     * @param value The data to store.
     * @param storeName Optional. The name of the object store. Required if multiple stores are configured.
     */
    setData: (key: string, value: any, storeName?: string) => Promise<void>
    /**
     * Retrieves data from a specified store. If only one store is configured, `storeName` is optional.
     * @param key The key of the data to retrieve.
     * @param storeName Optional. The name of the object store. Required if multiple stores are configured.
     */
    getData: <T = any>(key: string, storeName?: string) => Promise<T | undefined>
    /**
     * Deletes data from a specified store. If only one store is configured, `storeName` is optional.
     * @param key The key of the data to delete.
     * @param storeName Optional. The name of the object store. Required if multiple stores are configured.
     */
    deleteData: (key: string, storeName?: string) => Promise<void>
    /**
     * Returns a Promise that resolves to true when the IndexedDB client is ready
     * (initialized successfully or fallen back to storage).
     */
    isReady: () => Promise<boolean>

    /**
     * Returns a BasicStoreClient for a specific object store.
     * Use this when you are working with multiple stores and want a simpler interface for a single store.
     * @param storeName The name of the object store.
     */
    getClientFor: (storeName: string) => BasicStoreClient
}

const clientCache = new Map<string, IDBClient>()

/**
 * A Vue composable for interacting with IndexedDB, with a fallback to localStorage or sessionStorage.
 * Supports single or multiple object stores within a single database.
 * @param dbName The name of the IndexedDB database.
 * @param storeNames The name(s) of the object store(s) to use. Can be a string or an array of strings.
 * @param fallback The fallback storage type ('local' for localStorage, 'session' for sessionStorage). Defaults to 'local'.
 * @returns An IDBClient instance for data operations.
 */
export const useIDBClient = (
    dbName: string,
    storeNames: string | string[],
    fallback: FallbackType = 'local',
    allowDynamicStore: boolean = false,
): IDBClient => {
    const stores = Array.isArray(storeNames) ? storeNames : [storeNames]
    const isSingleStore = stores.length === 1
    let useFallback = false

    const fallbackStorageMap = shallowRef(new Map<string, Record<string, any>>())

    // Create a unique cache key based on dbName, storeNames, and fallback type
    const cacheKey = `${dbName}/${stores.join(',')}/${fallback}`
    if (clientCache.has(cacheKey)) {
        return clientCache.get(cacheKey)!
    }

    let dbPromise: Promise<IDBPDatabase> | null = null
    let initPromise: Promise<boolean> // <--- NEW: Promise to track initialization status

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
            return true // Successfully initialized IndexedDB
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
            return true // Successfully fell back to storage
        }
    }

    // Fire-and-forget init, but store its promise
    initPromise = init()

    // 
    const ensureStoreExists = async (storeName: string): Promise<void> => {
        if (!allowDynamicStore) return

        const db = await dbPromise!
        if (db.objectStoreNames.contains(storeName)) return

        const newVersion = db.version + 1
        db.close()

        dbPromise = openDB(dbName, newVersion, {
            upgrade(upgradeDb) {
                if (!upgradeDb.objectStoreNames.contains(storeName)) {
                    upgradeDb.createObjectStore(storeName)
                }
            },
        })

        await dbPromise
    }


    const resolveStore = (storeName?: string): string => {
        if (isSingleStore) {
            if (storeName && storeName !== stores[0]) {
                console.warn(`[useIDBClient] Specified storeName "${storeName}" ignored as only a single store "${stores[0]}" is configured.`)
            }
            return stores[0]
        }
        if (!storeName) {
            throw new Error(`[useIDBClient] Must specify store name when using multiple stores: ${stores.join(', ')}`)
        }
        if (!stores.includes(storeName)) {
            throw new Error(`[useIDBClient] Invalid store name: "${storeName}". Available stores: ${stores.join(', ')}`)
        }
        return storeName
    }

    const client: IDBClient = {
        async setData(key: string, value: any, storeName?: string) {
            await initPromise; // Ensure client is ready before any operation
            const store = resolveStore(storeName)
            if (useFallback) {
                if (!fallbackStorageMap.value.has(store)) {
                    const storageKey = `fallback:${dbName}/${store}/${fallback}`
                    const newFallbackStore =
                        fallback === 'session'
                            ? useSessionStorage<Record<string, any>>(storageKey, {})
                            : useLocalStorage<Record<string, any>>(storageKey, {})
                    fallbackStorageMap.value.set(store, newFallbackStore.value)
                }
                fallbackStorageMap.value.get(store)![key] = value
            } else {
                await ensureStoreExists(store)
                const db = await dbPromise!
                await db.put(store, value, key)
            }
        },

        async getData<T = any>(key: string, storeName?: string) {
            await initPromise; // Ensure client is ready before any operation
            const store = resolveStore(storeName)
            if (useFallback) {
                return fallbackStorageMap.value.get(store)?.[key] as T
            } else {
                await ensureStoreExists(store)
                const db = await dbPromise!
                return db.get(store, key)
            }
        },

        async deleteData(key: string, storeName?: string) {
            await initPromise; // Ensure client is ready before any operation
            const store = resolveStore(storeName)
            if (useFallback) {
                const storeData = fallbackStorageMap.value.get(store)
                if (storeData) {
                    delete storeData[key]
                }
            } else {
                const db = await dbPromise!
                if (!db.objectStoreNames.contains(store)) return
                await db.delete(store, key)
            }
        },

        // isReady now returns the initPromise directly
        isReady() {
            return initPromise;
        },

        getClientFor: (storeName: string): BasicStoreClient => {
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
        },
    }

    clientCache.set(cacheKey, client)
    return client
}