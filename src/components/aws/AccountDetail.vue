<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import Spinners from '../Spinners.vue'

interface AccountDetail {
    id: string
    alias: string
    accessKeyId: string
    secretAccessKey: string
    region: string
    createdAt: number
}

const route = useRoute()
const isLoading = ref(false)
const account = ref<AccountDetail | null>(null)
const accountId = route.params.accountId as string
const accountDetailEndpoint = import.meta.env.REACT_APP_AWS_SERVER + 'v1/accounts/' + accountId

const fetchData = async () => {
    if (accountId == undefined || isLoading.value) {
        return
    }

    isLoading.value = true
    const res = await fetch(accountDetailEndpoint)
    account.value = await res.json()
    isLoading.value = false
}

fetchData() 
</script>

<template>
    <div class="full-content">
        <Spinners v-if="isLoading"></Spinners>
        <div v-if="!isLoading">
            <div class="mb-3 row">
                <label class="col-sm-2 col-form-label">ID</label>
                <label class="col-sm-10 col-form-label">{{ account?.id }}</label>
            </div>
            <div class="mb-3 row">
                <label class="col-sm-2 col-form-label">Region</label>
                <label class="col-sm-10 col-form-label">{{ account?.region }}</label>
            </div>
            <div class="mb-3 row">
                <label class="col-sm-2 col-form-label">Alias</label>
                <label class="col-sm-10 col-form-label">{{ account?.alias }}</label>
            </div>
            <div class="mb-3 row">
                <label class="col-sm-2 col-form-label">AccessKeyId</label>
                <label class="col-sm-10 col-form-label">{{ account?.accessKeyId }}</label>
            </div>
            <div class="mb-3 row">
                <label class="col-sm-2 col-form-label">SecretAccessKey</label>
                <label class="col-sm-10 col-form-label">{{ account?.secretAccessKey }}</label>
            </div>
            <div class="mb-3 row">
                <label class="col-sm-2 col-form-label">CreatedAt</label>
                <label class="col-sm-10 col-form-label">{{ account?.createdAt }}</label>
            </div>
        </div>

    </div>
</template>

<style scoped></style>
