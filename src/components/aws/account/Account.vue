<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/plugins/auth'
import TableAndPaging from '@/common/TableAndPaging.vue'
import type { TableField } from '@/common/TableAndPaging.vue'
import VuetifyModal from '@/common/VuetifyModal.vue'
import Edit from './Edit.vue'

import { getAccountsWithPaging, deleteAccount, defaultAccount as defaultAccountraw } from './account'
import type { Account } from './account'
import { timeFormat } from '@/tools/timeFormat'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const router = useRouter()

const authService = useAuth()
const accounts = ref<Account[]>([])
const defaultAccount = ref<Account>(JSON.parse(localStorage.getItem('defaultAccount') ?? '{}'))
const isLoading = ref(true)
const limit = ref(30)
const page = ref(1)
const selecedAccount = ref<Account>(defaultAccountraw)
const dialog = ref(false)

let fields: TableField[] = [
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
        key: 'valid',
        label: 'Valid'
    },
]

if (authService.isAuthenticated()) {
    fields.push({
        key: 'operation',
        label: 'Operation'
    })
}

const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await getAccountsWithPaging(page.value, limit.value)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    accounts.value = data ?? []
    for (let i = 0; i < accounts.value.length; i++) {
        const element = accounts.value[i]
        setDefaultAccount(element)
    }
}

watchEffect(async () => fetchData())

const updatePage = (n: number) => {
    page.value = n
}

const changePagesize = (n: number) => {
    limit.value = n
}

const close = () => {
    dialog.value = false
    selecedAccount.value = defaultAccountraw
}

const accountDelete = async (id: string) => {
    if (!authService.isAuthenticated()) {
        return
    }

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

const setAccount = (alias: string) => {
    const account = accounts.value.find(p => p.alias == alias)
    if (account) {
        selecedAccount.value = account
    } else {
        selecedAccount.value = defaultAccountraw
    }
}

const setDefaultAccount = (acc: Account) => {
    if (acc.valid) {
        localStorage.setItem('defaultAccount', JSON.stringify(acc))
        defaultAccount.value = acc
    }
}

</script>

<template>
    <v-sheet class="d-flex flex-column" height="100%">
        <v-toolbar color="blue-lighten-5">
            <v-toolbar-title>Account</v-toolbar-title>
            <h2 class="text-subtitle-1">Current Default Account is : {{ defaultAccount?.alias }}</h2>
            <v-spacer></v-spacer>
            <VuetifyModal v-model:dialog="dialog" text="Create Account" :width="700" :persistent="true"
                v-if="authService.isAuthenticated()" title="Create Account" hideFooter>
                <Edit @save="close" @close="close" :account="selecedAccount"></Edit>
            </VuetifyModal>
        </v-toolbar>
        <TableAndPaging :items="accounts" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <template v-slot:body_alias="body">
                <span @click="setAccount(body.alias)" :class="{ 'detail-link': authService.isAuthenticated() }">
                    {{ body.alias }}
                </span>
            </template>
            <template v-slot:body_operation="body">
                <v-btn class="mr-3" @click="setDefaultAccount(body)" v-if="body.valid"> Default
                </v-btn>
                <v-btn @click="accountDelete(body.id)"> Delete </v-btn>
            </template>
        </TableAndPaging>
    </v-sheet>
</template>
