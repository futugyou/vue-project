<script lang="ts" setup>
import { ref, watchEffect, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { join } from 'lodash-es'

import TableAndPaging, { TableField } from '@/components/TableAndPaging.vue'
import { Modal, ModalButton, closeModal } from '@/components/Modal.vue'
import Edit from './Edit.vue'

import { Account, getAccounts, deleteAccount } from './account'
import { useTimeFormat } from '@/composables/timeFormat'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const router = useRouter()

const accounts = ref<Account[]>([])
const defaultAccount = ref<Account>(JSON.parse(localStorage.getItem('defaultAccount') ?? '{}'))
const isLoading = ref(true)
const limit = ref(10)
const page = ref(1)
const editref = ref(null)

const timeFormat = (timestamp: number): string => {
    return useTimeFormat(timestamp)
}

const fields: TableField[] = [
    // {
    //     key: 'id',
    //     label: '#',
    //     header: true
    // },
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
    },
    {
        key: 'operation',
        label: 'Operation'
    }
] 

const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await getAccounts(page.value, limit.value)
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    accounts.value = data ?? []
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

const close = () => {
    closeModal()
}

const accountDelete = async (id: string) => {
    const answer = window.confirm('Do you really want to delete?')
    if (answer) {
        await deleteAccount(id)
        if (id == defaultAccount.value.id) {
            defaultAccount.value = JSON.parse('{}')
            localStorage.removeItem('defaultAccount')
        }

        router.push({
            force: true,
            path: '/account'
        })
        router.go(0)
    }
}

const setDefaultAccount = (acc: Account) => {
    localStorage.setItem('defaultAccount', JSON.stringify(acc))
    defaultAccount.value = acc
}
</script>

<template>
    <div class="account-full-content">
        <Modal id="accountModal" title="Create Account" :hideFooter="true">
            <Edit ref="editref" @save="close" @close="close"></Edit>
        </Modal>
        <div class="head-content">
            <div class="">
                <h1>account</h1>
            </div>
            <div class="">
                <span>Current Default Account is : {{ defaultAccount?.alias }}</span>
            </div>
            <div>
                <ModalButton targetId="#accountModal" title="Create Account"></ModalButton>
            </div>
        </div>
        <TableAndPaging :items="accounts" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <!-- <template v-slot:header_id="header">
                <span style="color: red">{{ header.label }}</span>
            </template> -->
            <template v-slot:body_alias="body">
                <router-link :to="'/account/' + body.id" page-path="" class="detail-link">
                    <span>
                        {{ body.alias }}
                    </span>
                </router-link>
            </template>
            <template v-slot:body_operation="body">
                <button type="button" class="btn btn-secondary gap-right-10" @click="setDefaultAccount(body)"> Default
                </button>
                <button type="button" class="btn btn-warning" @click="accountDelete(body.id)"> Delete </button>
            </template>
        </TableAndPaging>
    </div>
</template>

<style scoped>
.account-full-content {
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
