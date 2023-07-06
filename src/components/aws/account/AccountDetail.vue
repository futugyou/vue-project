<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import Spinners from '@/components/Spinners.vue'
import { useTimeFormat } from '@/composables/timeFormat'

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
        <div v-if="!isLoading" class="detail-container">
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
        </div>
    </div>
</template>

<style scoped>
.full-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.detail-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-align: left;
    max-width: 600px;
    width: 100%;
    font-size: 18px;
    background-color: aliceblue;
}

.detail-item {
    display: flex;
    flex-direction: row;
    height: 60px;
}

.detail-item-lable {
    flex: 1;
    display: flex;
    line-height: 18px;
    padding: 5px;
    margin: 5px;
    height: 40px;
    background-color: aquamarine;
    border-radius: 10px;
    align-content: center;
    flex-wrap: wrap;
}

.detail-item-content {
    flex: 1;
    display: flex;
    line-height: 18px;
    padding: 5px;
    margin: 5px;
    height: 40px;
    border-radius: 10px;
    align-content: center;
    flex-wrap: wrap;
}
</style>
