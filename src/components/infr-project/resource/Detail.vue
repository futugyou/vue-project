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

</script>

<template>
    <v-sheet class="d-flex flex-column align-center" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-card title="Resource Information" v-if="!isLoading" class="d-flex flex-column align-center">
            <v-card-text v-if="resource" class="text-truncate">
                <div class="d-flex ma-1 text-body-1 ga-3">
                    <div class="font-weight-bold flex-1-1 pa-3">ID</div>
                    <div class="pa-3">{{ resource.id }}</div>
                </div>
                <div class="d-flex ma-1 text-body-1 ga-3">
                    <div class="font-weight-bold flex-1-1 pa-3">Name</div>
                    <div class="pa-3">{{ resource.name }}</div>
                </div>
                <div class="d-flex ma-1 text-body-1 ga-3 ">
                    <div class="font-weight-bold flex-1-1 pa-3">Type</div>
                    <div class="pa-3">{{ resource.type }}</div>
                </div>
                <div class="d-flex ma-1 text-body-1 ga-3">
                    <div class="font-weight-bold flex-1-1 pa-3">Data</div>
                    <div class="pa-3">{{ resource.data }}</div>
                </div>
                <div class="d-flex ma-1 text-body-1 ga-3">
                    <div class="font-weight-bold flex-1-1 pa-3">Deleted</div>
                    <div class="pa-3">{{ resource.is_deleted }}</div>
                </div>
                <div class="d-flex ma-1 text-body-1 ga-3">
                    <div class="font-weight-bold flex-1-1 pa-3">CreatedAt</div>
                    <div class="pa-3">
                        {{ useTimeFormat(resource.created_at) }}
                    </div>
                </div>
                <div class="d-flex ma-1 text-body-1 ga-3">
                    <div class="font-weight-bold flex-1-1 pa-3">UpdatedAt</div>
                    <div class="pa-3">
                        {{ useTimeFormat(resource.updated_at) }}
                    </div>
                </div>
            </v-card-text> 
        </v-card> 
    </v-sheet>
</template>
