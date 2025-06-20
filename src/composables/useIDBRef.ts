// composables/useIDBRef.ts
import { ref, watch } from 'vue'
import { useIDBClient } from './useIDBClientEx'

export interface RemovableIDBRef<T> {
    value: T
    remove: () => Promise<void>
}

/**
 * A Vue composable that provides a reactive reference (`Ref`) to a value stored in IndexedDB.
 * Changes to the ref's value are automatically persisted to the database.
 * When a component uses only a single `table`, use this.
 * @example const loginUser = useIDBRef<GitHubUser>('db_name', 'table_name', 'key')
 * @param dbName The nameof the database`.
 * @param storeName The name of the object store within the database.
 * @param key The key under which the value is stored.
 * @param defaultValue An optional default value to use if the key is not found in the database.
 * @returns A RemovableIDBRef containing the reactive value and a `remove` function.
 */
export const useIDBRef = <T>(
    dbName: string,
    storeName: string,
    key: string,
    defaultValue?: T,
    fallback: 'local' | 'session' = 'local'
): RemovableIDBRef<T> => {
    const client = useIDBClient(dbName, storeName, fallback)

    const dataRef = ref(defaultValue as T)

    client.getData<T>(key).then(value => {
        if (value !== undefined) {
            dataRef.value = value
        }
    })

    watch(
        dataRef,
        (newVal) => {
            client.setData(key, newVal)
        },
        { deep: true }
    )

    return {
        get value() {
            return dataRef.value
        },
        set value(v: T) {
            dataRef.value = v
        },
        async remove() {
            await client.deleteData(key)
            dataRef.value = defaultValue as T
        }
    }
}
