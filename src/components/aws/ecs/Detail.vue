<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import Spinners from '@/common/Spinners.vue'
import VuetifyModal from '@/common/VuetifyModal.vue'
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
    <div class="detail-full-content">
        <Spinners v-if="isLoading"></Spinners>
        <div v-if="!isLoading && ecsServiceDetail" class="detail-container">
            <div class="compare-container">
                <v-btn variant="outlined" @click="compareDefinitions" :disabled="checkedTaskDefinitions.length != 2">
                    Compare Definitions
                </v-btn>
                <VuetifyModal text="Compare Definitions" title="Compare Definitions" activator="somme" hideFooter
                    v-model:dialog="dialog" @cancle="dialog = false;" :disabled="checkedTaskDefinitions.length != 2">
                    <Spinners v-if="subLoading"></Spinners>
                    <code-diff v-if="compareTaskDefinitions.length == 2 && subLoading == false" language="json"
                        :old-string="compareTaskDefinitions[0]" :new-string="compareTaskDefinitions[1]"
                        output-format="side-by-side" />
                </VuetifyModal>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Account Alias</div>
                <div class="detail-item-content">
                    {{ ecsServiceDetail.account_alias }}
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Cluster Name</div>
                <div class="detail-item-content">
                    {{ ecsServiceDetail.cluster_name }}
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Cluster Arn</div>
                <div class="detail-item-content">
                    {{ ecsServiceDetail.cluster_arn }}
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Service Name</div>
                <div class="detail-item-content">
                    {{ ecsServiceDetail.service }}
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Service Arn</div>
                <div class="detail-item-content">
                    {{ ecsServiceDetail.service_arn }}
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Role Arn</div>
                <div class="detail-item-content">
                    {{ ecsServiceDetail.role_arn }}
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Operate At</div>
                <div class="detail-item-content">
                    {{ ecsServiceDetail.operate_At }}
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Security Groups</div>
                <div class="detail-item-content">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item" v-for="sg in ecsServiceDetail.security_groups">
                            {{ sg }}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">VPC Subnets</div>
                <div class="detail-item-content">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item" v-for="net in ecsServiceDetail.subnets">
                            {{ net }}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Service Registries</div>
                <div class="detail-item-content">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item" v-for="sr in ecsServiceDetail.service_registries">
                            {{ sr }}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Latest 10 Task Definitions</div>
                <div class="detail-item-content content-scroll">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item" v-for="td in ecsServiceDetail.task_definitions">
                            <label class="form-check-label" :for="td">
                                {{ td }}
                            </label>
                            <v-checkbox v-model="checkedTaskDefinitions" density="compact" color="red" hide-details
                                :disabled="checkedTaskDefinitionsStatus(td)" :value="td" :id="td"></v-checkbox>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.detail-item {
    height: auto;
}

.detail-item-lable {
    align-content: flex-start;
    flex: 1;
}

.detail-item-content {
    flex: 3;
}

.list-group-item {
    background-color: inherit;
    padding-left: 0px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.content-scroll {
    flex-wrap: nowrap;
    overflow-y: scroll;
}

.form-check-input {
    margin-left: 20px;
    vertical-align: bottom;
}

.compare-container {
    position: absolute;
    right: 10px;
    top: 10px;
}
</style>
