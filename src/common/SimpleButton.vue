<script lang="ts" setup>
import { ref } from 'vue'
import Spinners from '@/common/Spinners.vue'

const emit = defineEmits<{
    (e: 'click'): void
}>()

const props = defineProps<{
    Text: string
    IsLoading?: boolean
}>()

const HandleClick = () => {
    if (!props.IsLoading) {
        emit('click')
    }
}

</script>

<template>
    <button @click="HandleClick" :disabled="props.IsLoading">
        <span v-if="!props.IsLoading">{{ Text }}</span>
        <Spinners :size="20" v-if="props.IsLoading"></Spinners>
    </button>
</template>

<style scoped >
button {
    padding: 2px 10px;
    border: rgba(84, 174, 255, 0.4) 1px solid;
    width: 100px;
    height: 30px;
    white-space: pre;
}

button:hover {
    box-shadow: 2px 2px 2px 2px rgb(0 0 255 / 20%);
}
</style>