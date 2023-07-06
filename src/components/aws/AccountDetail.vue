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
const isLoading = ref(true)
const account = ref<AccountDetail | null>(null)

const accountId = computed(() => route.params.accountId)
const accountDetailEndpoint = computed(() => import.meta.env.REACT_APP_AWS_SERVER + 'v1/accounts/' + accountId.value)

const fetchData = async () => {
    isLoading.value = true
    const res = await fetch(accountDetailEndpoint.value)
    account.value = await res.json()
    isLoading.value = false
}

watchEffect(async () => fetchData())

</script>

<template>
    <div class="full-content">
        <Spinners v-if="isLoading"></Spinners>
        <div v-if="!isLoading">
            this account is {{ account }}
        </div>

    </div>
</template>

<style scoped></style>
