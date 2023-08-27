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
                            {{ td }}
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
}

.content-scroll {
    flex-wrap: nowrap;
    overflow-y: scroll;
}
</style>
