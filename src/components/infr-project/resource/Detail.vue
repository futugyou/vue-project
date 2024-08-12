<script lang="ts" setup>
import { ref, } from 'vue'
import { useRoute, } from 'vue-router'
import { storeToRefs } from 'pinia'

import Spinners from '@/common/Spinners.vue'
import { useTimeFormat } from '@/composables/timeFormat'
import { useMessageStore } from '@/stores/message'

import { ResourceApiFactory, ResourceViewDetail } from './resource'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const route = useRoute()

const isLoading = ref(true)
const resourceId = route.params.id as string
const resource = ref<ResourceViewDetail>()

const fetchData = async () => {
    if (resourceId == undefined) {
        return
    }

    isLoading.value = true
    const { data, error } = await ResourceApiFactory().v1ResourceIdGet(resourceId)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }

        return
    }

    resource.value = data
}

fetchData()

const timeFormat = (timestamp: any): string => {
    return useTimeFormat(timestamp)
}

</script>

<template>
    <div class="detail-full-content">
        <Spinners v-if="isLoading"></Spinners>
        <div v-if="!isLoading" class="detail-container">
            <div class="detail-item">
                <div class="detail-item-lable">Name:</div>
                <div class="detail-item-content"> {{ resource?.name }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Type:</div>
                <div class="detail-item-content"> {{ resource?.type }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Version:</div>
                <div class="detail-item-content"> {{ resource?.version }}</div>
            </div>
            <div class="detail-item-textarea">
                <div class="detail-item-lable">Data:</div>
                <div class="textarea-container">
                    <textarea class="form-control" Disabled :value="resource?.data"></textarea>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Deleted:</div>
                <div class="detail-item-content"> {{ resource?.is_deleted }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">CreatedAt:</div>
                <div class="detail-item-content"> {{ timeFormat(resource?.created_at) }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">UpdatedAt:</div>
                <div class="detail-item-content"> {{ timeFormat(resource?.updated_at) }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.detail-full-content {
    justify-content: normal;
}

.detail-container {
    padding: 20px
}

.detail-item {
    height: auto;
}

.detail-item-textarea {
    display: flex;
    flex: 1;
    flex-direction: column;
}

.textarea-container {
    flex: 1;
}

.textarea-container>textarea {
    height: 100%;
}

.detail-item-lable {
    margin-right: 10px;
}
</style>
