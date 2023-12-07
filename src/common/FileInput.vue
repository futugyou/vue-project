<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import Spinners from '@/common/Spinners.vue'

const props = defineProps<{
    loading?: boolean
}>()

const labeltext = ref("choose file")
const emit = defineEmits<{
    (e: 'fileLoad', f: File): void
}>()

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target == null || target.files == null || target.files.length == 0 || !target.files[0]) {
        labeltext.value = "choose file"
        return
    }

    const file = target.files[0]
    labeltext.value = file.name
    emit('fileLoad', file)
}

onMounted(() => {
    labeltext.value = "choose file"
})

</script>

<template>
    <div class="file-container">
        <div style="flex:1">
            <form style="width: 100%;">
                <label for="file-reader" class="file-reader-label">{{ labeltext }}</label>
                <input id="file-reader" type="file" name="file-reader" class="file-reader-input" @change="onFileChange"
                    :disabled="loading" />
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

.file-reader-label {
    font-size: var(--font-size-body-m);
    border: 1px solid var(--color-border-text-normal-default);
    border-radius: var(--border-radius-input);
    padding-block: var(--space-scaled-xxs);
    padding-inline: var(--space-button-horizontal);
    line-height: 16px;
    white-space: nowrap;
    height: 36px;
    letter-spacing: .25px;
    align-items: center;
    text-align: left;
    box-sizing: border-box;
    color: var(--color-border-text-normal-default);
    cursor: pointer;
    display: inline-flex;
    font-family: "Google Sans", sans-serif;
    font-weight: 500;
    justify-content: flex-start;
    width: 100%;
}

.file-reader-input {
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    width: 0.1px;
    z-index: -1;
}
</style>