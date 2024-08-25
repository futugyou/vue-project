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
            <v-card-text v-if="resource" class="d-flex flex-column ga-3 text-truncate">
                <p class="text-h4 font-weight-black">{{ resource.name }}</p>
                <v-sheet class="d-flex flex-wrap ga-2">
                    <v-chip>
                        <strong>{{ resource.type }}</strong>&nbsp;
                    </v-chip>
                    <v-chip>
                        <strong>{{ resource.is_deleted ? 'deleted' : 'activated' }}</strong>&nbsp;
                    </v-chip>
                    <v-chip v-for="tag in resource.tags">
                        <strong>{{ tag }}</strong>&nbsp;
                    </v-chip>
                </v-sheet>

                <v-divider></v-divider>

                <v-img :aspect-ratio="1" :src="resource.data" v-if="resource.type == 'DrawIO'">
                    <template v-slot:error>
                        <v-sheet>
                            <span class="text-body-1 word-break">{{ resource.data }}</span>
                        </v-sheet>
                    </template>
                </v-img>
                <div v-if="resource.type != 'DrawIO'">
                    <span class="text-body-1 word-break">{{ resource.data }}</span>
                </div>

                <v-divider></v-divider>

                <v-chip-group >
                    <v-chip>CreatedAt: {{ useTimeFormat(resource.created_at) }}</v-chip>
                    <v-chip>UpdatedAt: {{ useTimeFormat(resource.updated_at) }}</v-chip>
                </v-chip-group>
            </v-card-text>
        </v-card>
    </v-sheet>
</template>
