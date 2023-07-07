<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue'

import TableAndPaging, { TableField } from '@/components/TableAndPaging.vue'
import { useTimeFormat } from '@/composables/timeFormat'

interface Account {
    id: string
    alias: string
    accessKeyId: string
    secretAccessKey: string
    region: string
    createdAt: number
}

const accounts = ref<Account[]>([])
const isLoading = ref(true)
const limit = ref(10)
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
        key: 'alias',
        label: 'Alias'
    },
    {
        key: 'accessKeyId',
        label: 'AccessKeyId'
    },
    {
        key: 'secretAccessKey',
        label: 'SecretAccessKey'
    },
    {
        key: 'region',
        label: 'Region'
    },
    {
        key: 'createdAt',
        label: 'CreatedAt',
        format: timeFormat
    }
]

const accountEndpoint = computed(() => {
    return (
        import.meta.env.REACT_APP_AWS_SERVER +
        'v1/accounts?page=' +
        page.value +
        '&limit=' +
        limit.value
    )
})

const fetchData = async () => {
    isLoading.value = true
    const res = await fetch(accountEndpoint.value)
    accounts.value = await res.json()
    // // mock delay
    // await new Promise((resolve) => setTimeout(resolve, 5000))
    isLoading.value = false
}

watchEffect(async () => fetchData())

const updatePage = (n: number) => {
    page.value = n
}

const changePagesize = (n: number) => {
    limit.value = n
}
</script>

<template>
    <div class="full-content">
        <div class="modal fade" id="accountModal" tabindex="-1" aria-labelledby="accountModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="accountModalLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="head-content">
            <div class="">
                <h1>account</h1>
            </div>
            <div>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#accountModal">
                    create account
                </button>
            </div>
        </div>
        <TableAndPaging :items="accounts" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <template v-slot:header_id="header">
                <span style="color: red">{{ header.label }}</span>
            </template>
            <template v-slot:body_id="body">
                <span style="color: green">
                    <router-link :to="'/account/' + body.id" page-path="">{{
                        body.id
                    }}</router-link>
                </span>
            </template>
        </TableAndPaging>
    </div>
</template>

<style scoped>
.full-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.head-content {
    display: flex;
    align-items: center;
    padding: 0px 10px;
    justify-content: space-between;
}
</style>
