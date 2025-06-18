// composables/useIDBClient.ts
import { ref } from 'vue'
import { openDB } from 'idb'
import type { IDBPDatabase } from 'idb'

interface IDBClient {
    setData: (key: string, value: any) => Promise<void>
    getData: <T = any>(key: string) => Promise<T | undefined>
    isReady: () => boolean
}

const clientCache = new Map<string, IDBClient>()

export const useIDBClient = (dbName: string, storeName: string): IDBClient => {
    const ready = ref(false)
    let dbPromise: Promise<IDBPDatabase> | null = null

    const key = `${dbName}/${storeName}`
    if (clientCache.has(key)) {
        return clientCache.get(key)!
    }

    dbPromise = openDB(dbName, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName)
            }
        },
    }).then(db => {
        ready.value = true
        return db
    })

    const client: IDBClient = {
        async setData(key: string, value: any) {
            const db = await dbPromise!
            await db.put(storeName, value, key)
        },
        async getData<T = any>(key: string) {
            const db = await dbPromise!
            return db.get(storeName, key)
        },
        isReady() {
            return ready.value
        },
    }

    clientCache.set(key, client)
    return client
}
