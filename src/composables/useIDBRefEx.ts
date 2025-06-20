// composables/useIDBRef.ts
import { ref, customRef } from 'vue' // No need for 'watch' with this customRef setup
import type { IDBClient, BasicStoreClient } from './useIDBClientEx'

export interface RemovableIDBRef<T> {
    value: T
    remove: () => Promise<void>
}

/**
 * A Vue composable that provides a reactive reference (`Ref`) to a value stored in IndexedDB.
 * Changes to the ref's value are automatically persisted to the database.
 * When a component uses only a multiple tables, use this.
 * @example 
 * const db = useIDBClient('db_name', ['table_1', 'table_2'])
 * const loginUser = useIDBRef<GitHubUser>(db, 'table_1', 'key') 
 * const tmpComment = useIDBRef<string>(db, 'table_2', 'key')
 * @param db The IDBClient instance obtained from `useIDBClient`.
 * @param storeName The name of the object store within the database.
 * @param key The key under which the value is stored.
 * @param defaultValue An optional default value to use if the key is not found in the database.
 * @returns A RemovableIDBRef containing the reactive value and a `remove` function.
 */
export const useIDBRef = <T>(
    db: IDBClient,
    storeName: string,
    key: string,
    defaultValue?: T,
): RemovableIDBRef<T> => {
    // Use getClientFor to get a specific store's client from the main IDBClient
    const client: BasicStoreClient = db.getClientFor(storeName)

    // We use a regular ref internally to hold the current value
    const internalValue = ref(defaultValue as T)

    // Use a customRef for more control over reactivity and persistence
    const idbRef = customRef<T>((track, trigger) => {
        let isInitialLoadComplete = false

        // Load initial data from IndexedDB when the IDBClient is ready
        db.isReady().then(async () => {
            const value = await client.getData<T>(key)
            if (value !== undefined) {
                internalValue.value = value // Update the internal ref with fetched data
            } else if (defaultValue !== undefined) {
                // If no value in DB and defaultValue exists, set it and persist
                internalValue.value = defaultValue as T
                await client.setData(key, defaultValue)
            }
            isInitialLoadComplete = true
            trigger() // Trigger a re-render after initial data is loaded
        })

        return {
            // The `get` method is called when the ref's value is accessed
            get() {
                track() // Track this dependency for reactivity
                return internalValue.value
            },
            // The `set` method is called when the ref's value is changed
            set(newValue: T) {
                // Only update and persist if the value has actually changed
                if (newValue !== internalValue.value) {
                    internalValue.value = newValue // Update the internal ref
                    if (isInitialLoadComplete) {
                        // Only persist changes to IDB after the initial data load is complete
                        client.setData(key, newValue)
                    }
                    trigger() // Trigger a re-render
                }
            },
        }
    })

    // The `remove` function deletes data from IDB and resets the ref's value
    const remove = async () => {
        await client.deleteData(key)
        // Reset both the internal ref and the exposed customRef value to the default
        internalValue.value = defaultValue as T
        idbRef.value = defaultValue as T
    }

    // Return the custom ref and the remove function
    return {
        value: idbRef.value,
        remove,
    }
}