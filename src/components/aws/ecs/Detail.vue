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
                    {{ ecsServiceDetail.security_groups }}
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">VPC Subnets</div>
                <div class="detail-item-content">
                    {{ ecsServiceDetail.subnets }}
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Service Registries</div>
                <div class="detail-item-content">
                    {{ ecsServiceDetail.service_registries }}
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Latest 10 Task Definitions</div>
                <div class="detail-item-content">
                    {{ ecsServiceDetail.task_definitions }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
