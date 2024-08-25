<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'

import TableAndPaging, { TableField } from '@/common/TableAndPaging.vue'
import { useTimeFormat } from '@/composables/timeFormat'
import { useMessageStore } from '@/stores/message'

import { ResourceView, ResourceApiFactory } from './resource'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const resources = ref<ResourceView[]>([])
const isLoading = ref(true)

const limit = ref(30)
const page = ref(1)

const timeFormat = (timestamp: any): string => {
    return useTimeFormat(timestamp)
}

const fields: TableField[] = [
    {
        key: 'name',
        label: 'Name'
    },
    {
        key: 'type',
        label: 'Type'
    },
    {
        key: 'version',
        label: 'Version'
    },
    {
        key: 'is_deleted',
        label: 'Deleted'
    },
    {
        key: 'created_at',
        label: 'CreatedAt',
        format: timeFormat
    },
    {
        key: 'updated_at',
        label: 'UpdatedAt',
        format: timeFormat
    }
]

const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await ResourceApiFactory().v1ResourceGet()
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    resources.value = data ?? []
}

const updatePage = (n: number) => {
    page.value = n
}

const changePagesize = (n: number) => {
    limit.value = n
}

watchEffect(async () => fetchData())

</script>

<template>
    <v-sheet class="d-flex flex-column" height="100%">
        <TableAndPaging :items="resources" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <template v-slot:header_id="header">
                <span style="color: red">{{ header.label }}</span>
            </template>
            <template v-slot:body_name="body">
                <router-link :to="'/resource/' + body.id" page-path="" class="detail-link">
                    <span>
                        {{ body.name }}
                    </span>
                </router-link>
            </template>
        </TableAndPaging>
    </v-sheet>
</template>

<style scoped>

</style>
