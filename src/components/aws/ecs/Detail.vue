<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import Spinners from '@/components/Spinners.vue' 
import { EcsService, getEcsServiceDetail } from "./ecs"

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const isLoading = ref(true)
const ecsServiceDetail = ref()
const route = useRoute()
const ecsserviceId = route.params.id as string

const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await getEcsServiceDetail(ecsserviceId)
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    ecsServiceDetail.value = data ?? []
    isLoading.value = false
}

watchEffect(async () => fetchData())
</script>

<template>
    <div class="detail-full-content">
        <Spinners v-if="isLoading"></Spinners>
        <div v-if="!isLoading && ecsServiceDetail" class="detail-container">
            {{ ecsServiceDetail }}
        </div>
    </div>
</template>

<style scoped> 
 
</style>
