<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import TableAndPaging, { TableField } from '@/common/TableAndPaging.vue'
import { EcsService, getEcsServices } from "./ecs"

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const router = useRouter()
const isLoading = ref(true)
const limit = ref(30)
const page = ref(1)
const ecsServices = ref<EcsService[]>([])

const account = ref('')

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
    const { data, error } = await getEcsServices(page.value, limit.value, account.value)
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


</script>

<template>
    <div class="ecs-full-content">
        <div class="head-content">
            <div class="">
                <h1>ecs service</h1>
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

.detail-link {
    width: 100%;
    height: 100%;
    display: block;
}

.gap-right-10 {
    margin-right: 10px;
}
</style>
