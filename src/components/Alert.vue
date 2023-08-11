<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'

const props = withDefaults(
    defineProps<{
        errorMessages: string[]
        delay?: number
    }>(),
    {
        errorMessages: () => {
            return []
        },
        delay: 0
    }
)

const showMessage = ref(false)
const errorMessages = computed(() => props.errorMessages)
const delay = computed(() => props.delay)

const checkDisplayState = (data: string[]) => {
    if (data.length >= 0) {
        showMessage.value = true

        if (delay.value > 0) {
            setTimeout(() => {
                showMessage.value = false
            }, delay.value)
        }
    } else {
        showMessage.value = false
    }
}

checkDisplayState(errorMessages.value)
watch(errorMessages, checkDisplayState)
</script>

<template>
    <div v-if="showMessage" class="alert-container">
        <div class="alert alert-danger check-message" role="alert" v-for="msg in errorMessages" :key="msg">
            {{ msg }}
        </div>
    </div>
</template>
<style scoped>
.alert-container {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 1;
}
</style>