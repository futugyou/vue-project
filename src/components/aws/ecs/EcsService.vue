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
    <div class="ecs-full-content">
        <div class="head-content">
            <div class="">
                <h1>ecs service</h1>
            </div>
            <div class="search-contatiner">
                <div class="search-item-contatiner">
                    <div class="search-item-lable">
                        <label for="region">
                            Account:
                        </label>
                    </div>
                    <div class="search-item-com">
                        <AccountList id="account" :selected="selectedAccount.id" @changeAccount="changeAccount">
                        </AccountList>
                    </div>
                </div>
            </div>
        </div>
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
    </div>
</template>

<style scoped>
.ecs-full-content {
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

.search-contatiner {
    display: flex;
    flex-direction: row;
    height: 40px;
}

div.search-contatiner>* {
    height: 100%;
}

.search-item-contatiner {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 30px;
}

.search-item-lable {
    margin-right: 10px;
    font-size: 20px;
}

.search-item-com {
    width: 200px;
    text-align: left;
}

.gap-right-10 {
    margin-right: 10px;
}
</style>
