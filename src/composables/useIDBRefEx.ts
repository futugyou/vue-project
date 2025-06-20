// composables/useIDBRefEx.ts
import { ref, watch } from 'vue'
import type { IDBClient } from './useIDBClientEx'

export interface RemovableIDBRef<T> {
    value: T
    remove: () => Promise<void>
}

export const useIDBRef = <T>(
    db: IDBClient,
    storeName: string,
    key: string,
    defaultValue?: T,
    fallback: 'local' | 'session' = 'local'
): RemovableIDBRef<T> => {
    const client = db.getClientFor(storeName)

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
