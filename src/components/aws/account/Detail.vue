<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/plugins/auth'

import Spinners from '@/common/Spinners.vue'
import { timeFormat } from '@/tools/timeFormat'
import { defaultAccount, getAccount, deleteAccount } from './account'
import type { Account } from './account'
import Edit from './Edit.vue'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const route = useRoute()
const router = useRouter()
const authService = useAuth()

const isLoading = ref(true)
const editModel = ref(false)
const account = ref<Account>(defaultAccount)
const accountId = route.params.accountId as string

const fetchData = async () => {
    if (accountId == undefined) {
        return
    }

    isLoading.value = true
    const { data, error } = await getAccount(accountId)
    isLoading.value = false

    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    account.value = data
}

fetchData()

const editAccount = () => {
    editModel.value = !editModel.value
}

const accountDelete = async () => {
    const answer = window.confirm('Do you really want to delete?')
    if (answer) {
        await deleteAccount(account.value.id)
        router.push('/account')
        router.go(0)
    }
}
</script>

<template>
    <v-sheet class="d-flex flex-column align-center" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-card title="Account Information" v-if="!isLoading && !editModel" class="d-flex flex-column align-center">
            <v-card-text v-if="account" class="text-truncate">
                <div class="d-flex ma-1 text-body-1 ga-3">
                    <div class="font-weight-bold flex-1-1 pa-3">ID</div>
                    <div class="pa-3">{{ account.id }}</div>
                </div>
                <div class="d-flex ma-1 text-body-1 ga-3">
                    <div class="font-weight-bold flex-1-1 pa-3">Region</div>
                    <div class="pa-3">{{ account.region }}</div>
                </div>
                <div class="d-flex ma-1 text-body-1 ga-3 ">
                    <div class="font-weight-bold flex-1-1 pa-3">Alias</div>
                    <div class="pa-3">{{ account.alias }}</div>
                </div>
                <div class="d-flex ma-1 text-body-1 ga-3">
                    <div class="font-weight-bold flex-1-1 pa-3">AccessKeyId</div>
                    <div class="pa-3">{{ account.accessKeyId }}</div>
                </div>
                <div class="d-flex ma-1 text-body-1 ga-3">
                    <div class="font-weight-bold flex-1-1 pa-3">SecretAccessKey</div>
                    <div class="pa-3">{{ account.secretAccessKey }}</div>
                </div>
                <div class="d-flex ma-1 text-body-1 ga-3">
                    <div class="font-weight-bold flex-1-1 pa-3">CreatedAt</div>
                    <div class="pa-3">
                        {{ timeFormat(account.createdAt) }}
                    </div>
                </div>
            </v-card-text>

            <v-card-actions>
                <v-btn color="primary" variant="outlined" @click="editAccount" v-if="authService.isAuthenticated()">
                    Edit Account
                </v-btn>
                <v-btn color="secondary" variant="outlined" @click="accountDelete" v-if="authService.isAuthenticated()">
                    Delete Account
                </v-btn>
            </v-card-actions>
        </v-card>
        <Edit v-if="editModel && authService.isAuthenticated()" @close="editAccount" :account="account"
            @save="editAccount"></Edit>
    </v-sheet>
</template>
