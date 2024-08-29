<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import Spinners from '@/common/Spinners.vue'
import VuetifyModal from '@/common/VuetifyModal.vue'
import { timeFormat } from '@/tools/timeFormat'
import { getEcsServiceDetail, compareEcsTaskDefinition, EcsTaskCompare } from "./ecs"

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const isLoading = ref(true)
const subLoading = ref(true)
const ecsServiceDetail = ref()
const route = useRoute()
const ecsserviceId = route.params.id as string
const dialog = ref(false)

const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await getEcsServiceDetail(ecsserviceId)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    ecsServiceDetail.value = data ?? []
}

watchEffect(async () => fetchData())


// max compare count is 2
const checkedTaskDefinitions = ref<string[]>([])
const compareTaskDefinitions = ref<string[]>([])
const checkedTaskDefinitionsStatus = (id: string) => {
    if (checkedTaskDefinitions.value.length >= 2 && checkedTaskDefinitions.value.findIndex(i => i == id) == -1) {
        return true
    }

    return false
}

const compareDefinitions = async () => {
    compareTaskDefinitions.value = []
    let model: EcsTaskCompare = {
        Id: ecsServiceDetail.value.id,
        source_task_arn: checkedTaskDefinitions.value[0],
        dest_task_arn: checkedTaskDefinitions.value[1]
    }

    dialog.value = true
    subLoading.value = true
    const { data, error } = await compareEcsTaskDefinition(model)
    subLoading.value = false

    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    compareTaskDefinitions.value = data
}
</script>

<template>
    <v-sheet class="d-flex flex-column overflow-hidden position-relative" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <div class="compare-container">
            <v-btn @click="compareDefinitions" :disabled="checkedTaskDefinitions.length != 2">
                Compare Definitions
            </v-btn>
            <VuetifyModal text="Compare Definitions" title="Compare Definitions" activator="somme" hideFooter
                v-model:dialog="dialog" :disabled="checkedTaskDefinitions.length != 2">
                <Spinners v-if="subLoading"></Spinners>
                <code-diff v-if="compareTaskDefinitions.length == 2 && subLoading == false" language="json"
                    :old-string="compareTaskDefinitions[0]" :new-string="compareTaskDefinitions[1]"
                    output-format="side-by-side" />
            </VuetifyModal>
        </div>
        <!-- </div> -->
        <v-container max-width="100%" max-height="100%" v-if="!isLoading && ecsServiceDetail">
            <v-row class="mb-6" no-gutters>
                <v-col>
                    <v-list lines="two" class="overflow-hidden" height="100%">
                        <v-list-item title="Account Alias" :subtitle="ecsServiceDetail.account_alias"></v-list-item>
                        <v-list-item title="Cluster Name" :subtitle="ecsServiceDetail.cluster_name"></v-list-item>
                        <v-list-item title="Cluster Arn" :subtitle="ecsServiceDetail.cluster_arn"></v-list-item>
                        <v-list-item title="Service Name" :subtitle="ecsServiceDetail.service"></v-list-item>
                        <v-list-item title="Service Arn" :subtitle="ecsServiceDetail.service_arn"></v-list-item>
                        <v-list-item title="Role Arn" :subtitle="ecsServiceDetail.role_arn"></v-list-item>
                        <v-list-item title="Operate At"
                            :subtitle="timeFormat(ecsServiceDetail.operate_At)"></v-list-item>
                        <v-list-group>
                            <template v-slot:activator="{ props }">
                                <v-list-item v-bind="props" title="Security Groups"></v-list-item>
                            </template>
                            <v-list-item :key="sg" :title="sg" v-for="sg in ecsServiceDetail.security_groups">
                            </v-list-item>
                        </v-list-group>
                        <v-list-group>
                            <template v-slot:activator="{ props }">
                                <v-list-item v-bind="props" title="VPC Subnets"></v-list-item>
                            </template>
                            <v-list-item :key="sg" :title="sg" v-for="sg in ecsServiceDetail.subnets">
                            </v-list-item>
                        </v-list-group>
                        <v-list-group>
                            <template v-slot:activator="{ props }">
                                <v-list-item v-bind="props" title="Service Registries"></v-list-item>
                            </template>
                            <v-list-item :key="sg" :title="sg" v-for="sg in ecsServiceDetail.service_registries">
                            </v-list-item>
                        </v-list-group>
                    </v-list>
                </v-col>

                <v-col>
                    <v-list height="100%">
                        <v-list-item title="Latest 10 Task Definitions">
                            <v-list-item-subtitle>
                                <v-checkbox :label="td" v-model="checkedTaskDefinitions"
                                    :disabled="checkedTaskDefinitionsStatus(td)" :value="td" :id="td" :key="td"
                                    v-for="td in ecsServiceDetail.task_definitions">
                                </v-checkbox>
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<style scoped>
.compare-container {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 10;
}
</style>
