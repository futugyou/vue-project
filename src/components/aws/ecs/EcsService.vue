<script lang="ts" setup>
import { ref, watchEffect } from 'vue'

import TableAndPaging, { TableField } from '@/common/TableAndPaging.vue'
import { EcsService, getEcsServices } from "./ecs"
import { Account, defaultAccount } from '@/components/aws/account/account'
import AccountList from "@/components/aws/account/list.vue"

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const isLoading = ref(true)
const limit = ref(30)
const page = ref(1)
const ecsServices = ref<EcsService[]>([])

const selectedAccount = ref<Account>(defaultAccount)

const fields: TableField[] = [
    {
        key: 'id',
        label: '#',
        header: true
    },
    {
        key: 'account_alias',
        label: 'Account Alias'
    },
    {
        key: 'cluster_name',
        label: 'Cluster Name'
    },
    {
        key: 'service_name',
        label: 'Service Name'
    },
    {
        key: 'operate_At',
        label: 'Operate At'
    }
]

const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await getEcsServices(page.value, limit.value, selectedAccount.value.id)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    ecsServices.value = data ?? []
}

watchEffect(async () => fetchData())

const updatePage = (n: number) => {
    page.value = n
}

const changePagesize = (n: number) => {
    limit.value = n
}

const changeAccount = (acc: Account) => {
    selectedAccount.value = acc
    ecsServices.value = []
}
</script>

<template>
    <v-sheet class="d-flex flex-column" height="100%">
        <v-toolbar color="blue-lighten-5">
            <v-toolbar-title>ECS Service</v-toolbar-title>
            <label class="text-subtitle-1 mr-2" for="region">
                Account:
            </label>
            <AccountList id="account" :selected="selectedAccount.id" @changeAccount="changeAccount">
            </AccountList>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
        </v-toolbar>
        <TableAndPaging :items="ecsServices" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <template v-slot:header_id="header">
                <span style="color: red">{{ header.label }}</span>
            </template>
            <template v-slot:body_id="body">
                <router-link :to="'/ecs/' + body.id" page-path="" class="detail-link">
                    <span>
                        {{ body.id }}
                    </span>
                </router-link>
            </template>
        </TableAndPaging>
    </v-sheet>
</template>
