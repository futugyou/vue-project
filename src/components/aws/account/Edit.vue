<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import type { PropType } from 'vue'

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

const defaultAccount: AccountDetail = {
    id: '',
    alias: '',
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
    createdAt: 0
}

const props = defineProps({
    account: {
        type: Object as PropType<AccountDetail>,
        default() {
            return {
                id: '',
                alias: '',
                accessKeyId: '',
                secretAccessKey: '',
                region: '',
                createdAt: 0
            }
        }
    },
})

const isLoading = ref(false)
const account = ref<AccountDetail>(props.account)

</script>

<template>
    <div class="full-content">
        <Spinners v-if="isLoading"></Spinners>
        <div v-if="!isLoading" class="detail-container">
            <div class="detail-item" v-if="account?.id">
                <div class="detail-item-lable">ID</div>
                <div class="detail-item-content">{{ account?.id }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Region</div>
                <div class="detail-item-content">
                    <input v-model="account.region" />
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Alias</div>
                <div class="detail-item-content">
                    <input v-model="account.alias" />
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">AccessKeyId</div>
                <div class="detail-item-content">
                    <input v-model="account.accessKeyId" />
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">SecretAccessKey</div>
                <div class="detail-item-content">
                    <input v-model="account.secretAccessKey" />
                </div>
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
    background-color: #e2f7f0;
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
