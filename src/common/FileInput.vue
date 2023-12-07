<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import Spinners from '@/common/Spinners.vue'

const props = defineProps<{
    loading?: boolean
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
    <div class="file-container">
        <div style="flex:1">
            <form style="width: 100%;">
                <input type="file" @change="onFileChange" :disabled="loading" />
            </form>
        </div>
        <div style="display: flex;align-items: center;padding-left: 10px;">
            <Spinners v-if="loading" width="20px" height="20px"></Spinners>
        </div>
    </div>
</template>

<style scoped >
.file-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    grid-gap: var(--grid-gap-10);
}
</style>