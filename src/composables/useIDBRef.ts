import { ref, watch } from 'vue'
import { useIDBClient } from './useIDBClient'

export interface RemovableIDBRef<T> {
    value: T
    remove: () => Promise<void>
}

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
