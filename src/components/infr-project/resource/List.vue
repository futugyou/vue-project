<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'

import TableAndPaging, { TableField } from '@/common/TableAndPaging.vue'
import { useTimeFormat } from '@/composables/timeFormat'
import { useMessageStore } from '@/stores/message'

import { ViewmodelsResourceView, ResourceApiFactory } from './resource'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const resources = ref<ViewmodelsResourceView[]>([])
const isLoading = ref(true)

const limit = ref(30)
const page = ref(1)

const timeFormat = (timestamp: number): string => {
    return useTimeFormat(timestamp)
}

const fields: TableField[] = [
    {
        key: 'id',
        label: '#',
        header: true
    },
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
        key: 'data',
        label: 'Data'
    },
    {
        key: 'is_deleted',
        label: 'Deleted'
    },
    {
        key: 'createdAt',
        label: 'CreatedAt',
        format: timeFormat
    },
    {
        key: 'updatedAt',
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
    <div class="resource-full-content">
        <div class="head-content">
        </div>
        <TableAndPaging :items="resources" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <template v-slot:header_id="header">
                <span style="color: red">{{ header.label }}</span>
            </template>
            <template v-slot:body_id="body">
                <router-link :to="'/resource/' + body.id" page-path="" class="detail-link">
                    <span>
                        {{ body.id }}
                    </span>
                </router-link>
            </template>
        </TableAndPaging>
    </div>
</template>

<style scoped>
.resource-full-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}

.head-content {
    display: flex;
    align-items: center;
    padding: 0px 10px;
    justify-content: space-between;
}

.detail-link {
    width: 100%;
    height: 100%;
    display: block;
}
</style>
