<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Spinners from '@/common/Spinners.vue'
import { useTimeFormat } from '@/composables/timeFormat'
import { Account, defaultAccount, getAccount, deleteAccount } from './account'
import Edit from './Edit.vue'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const route = useRoute()
const router = useRouter()

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
    <div class="detail-full-content">
        <Spinners v-if="isLoading"></Spinners>
        <div v-if="!isLoading && !editModel" class="detail-container">
            <div class="detail-item">
                <div class="detail-item-lable">ID</div>
                <div class="detail-item-content">{{ account?.id }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Region</div>
                <div class="detail-item-content">{{ account?.region }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Alias</div>
                <div class="detail-item-content">{{ account?.alias }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">AccessKeyId</div>
                <div class="detail-item-content">{{ account?.accessKeyId }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">SecretAccessKey</div>
                <div class="detail-item-content">{{ account?.secretAccessKey }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">CreatedAt</div>
                <div class="detail-item-content">
                    {{ account ? useTimeFormat(account.createdAt) : '' }}
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-content">
                    <button type="button" class="btn btn-secondary" @click="editAccount">
                        Edit Account
                    </button>
                </div>
                <div class="detail-item-content">
                    <button type="button" class="btn btn-warning" @click="accountDelete">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
        <Edit v-if="editModel" @close="editAccount" :account="account" @save="editAccount"></Edit>
    </div>
</template>

<style scoped> .detail-container {
     height: auto;
 }

 .detail-item-lable {
     flex: 0.5;
     padding: 5px;
     margin: 5px;
     background-color: #e2f7f0;
 }

 .detail-item-content {
     flex: 1;
     padding: 5px;
     margin: 5px;
     height: 40px;
 }
</style>
