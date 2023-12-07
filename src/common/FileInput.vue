<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const props = defineProps<{
    loading?: false
}>()

const emit = defineEmits<{
    (e: 'fileLoad', f: File): void
}>()

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target == null || target.files == null || target.files.length == 0 || !target.files[0]) {
        return
    }

    const file = target.files[0]
    emit('fileLoad', file)
}

</script>

<template>
    <input type="file" @change="onFileChange" :disabled="loading" />
</template>

<style scoped >
input[type="file"] {
    width: 100%;
}
</style>