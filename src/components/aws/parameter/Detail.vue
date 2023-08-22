<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Spinners from '@/components/Spinners.vue'
import { useTimeFormat } from '@/composables/timeFormat'
import { Parameter, getParameter, } from './parameter'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const parameterId = route.params.parameterId as string
const parameter = ref()
const awsparameter = ref() 

const tabIndex = ref("1")
const fetchData = async () => {
    if (parameterId == undefined) {
        return
    }

    isLoading.value = true
    const { data, error } = await getParameter(parameterId)
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        isLoading.value = false
        return
    }

    parameter.value = data
    awsparameter.value = data?.current 
    isLoading.value = false
}

fetchData()

const changeTab = (index: string) => {
    tabIndex.value = index
}
</script>

<template>
    <div class="detail-full-content">
        <Spinners v-if="isLoading"></Spinners>
        <div v-if="!isLoading">
            <ul class="nav nav-tabs">
                <li class="nav-item" @click="changeTab('1')">
                    <a class="nav-link" :class="{ active: tabIndex == '1' }" href="#">Latest</a>
                </li>
                <li class="nav-item" @click="changeTab('2')">
                    <a class="nav-link" :class="{ active: tabIndex == '2' }" href="#">AWS
                        Current</a>
                </li>
                <li class="nav-item" @click="changeTab('3')">
                    <a class="nav-link" :class="{ active: tabIndex == '3' }" href="#">History</a>
                </li>
            </ul>
        </div>
        <div v-if="!isLoading && parameter != undefined && tabIndex == '1'" class="detail-container">
            <div class="detail-item">
                <div class="detail-item-lable">Name:</div>
                <div> {{ parameter.key }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Version:</div>
                <div> {{ parameter.version }}</div>
            </div>
            <div class="detail-item-textarea">
                <div class="detail-item-lable">Value:</div>
                <div class="textarea-container">
                    <textarea class="form-control" id="exampleFormControlTextarea1" Disabled
                        :value="parameter.value"></textarea>
                </div>
            </div>
        </div>
        <div v-if="!isLoading && awsparameter != undefined && tabIndex == '2'" class="detail-container">
            <div class="detail-item">
                <div class="detail-item-lable">Name:</div>
                <div> {{ awsparameter.key }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Version:</div>
                <div> {{ awsparameter.version }}</div>
            </div>
            <div class="detail-item-textarea">
                <div class="detail-item-lable">Value:</div>
                <div class="textarea-container">
                    <textarea class="form-control" id="exampleFormControlTextarea1" Disabled
                        :value="awsparameter.value"></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.detail-full-content {
    display: flex;
    flex-direction: column;
    /* justify-content: space-around; */
    align-items: center;
    width: 100%;
    height: 100%;
}

.detail-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-align: left;
    width: 100%;
    font-size: 18px;
    background-color: aliceblue;
    padding: 20px
}

.detail-item {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
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
