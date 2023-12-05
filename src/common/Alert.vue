<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { MessageInfo, useMessageStore } from '@/stores/message'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const showMessage = ref(false)
const errorMessages = ref([''])

const checkDisplayState = () => {
    let data = msg.value
    if (data && data.errorMessages && data.errorMessages.length >= 0) {
        showMessage.value = true
        errorMessages.value = data.errorMessages
        let delay = 3000
        if (data.delay && data.delay > 0) {
            delay = data.delay
        }

        if (delay > 0) {
            setTimeout(() => {
                showMessage.value = false
            }, delay)
        }
    } else {
        errorMessages.value = []
        showMessage.value = false
    }
}

checkDisplayState()
watch(msg, checkDisplayState)
</script>

<template>
    <div v-if="showMessage" class="alert-container">
        <div class="alert alert-danger check-message" role="alert" v-for="text in errorMessages" :key="text">
            {{ text }}
        </div>
    </div>
</template>
<style scoped>
.alert-container {
    top: 50px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 1100;
}
</style>