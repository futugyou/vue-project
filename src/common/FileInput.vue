<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import Spinners from '@/common/Spinners.vue'
import Close from '@/icons/Close.vue'
import Button from '@/common/Button.vue'

const props = defineProps<{
    loading?: boolean
}>()

const labeltext = ref("choose file")
const isOver = ref(false)
const hasFile = ref(false)
const fileref = ref<HTMLInputElement>()

const emit = defineEmits<{
    (e: 'fileLoad', f: File): void
    (e: 'clear'): void
}>()

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target == null || target.files == null || target.files.length == 0 || !target.files[0]) {
        labeltext.value = "choose or drag a file"
        hasFile.value = false
        return
    }

    const file = target.files[0]
    handlerFile(file)
}

const onFileDrop = (event: DragEvent) => {
    if (!event.dataTransfer) {
        labeltext.value = "choose or drag a file"
        return
    }

    const file = event.dataTransfer.files[0]
    handlerFile(file)
}

const handlerFile = (file: File) => {
    labeltext.value = file.name
    emit('fileLoad', file)
    hasFile.value = true
}

const onFileDropover = () => {
    isOver.value = true
}

const onFileDropleave = () => {
    isOver.value = false
}

const clearFile = () => {
    if (fileref.value) {
        fileref.value.files = null
        labeltext.value = "choose or drag a file"
        hasFile.value = false
        emit('clear')
    }
}

onMounted(() => {
    labeltext.value = "choose or drag a file"
    hasFile.value = false
})

</script>

<template>
    <div class="file-container">
        <div style="flex:1" @dragover.prevent="onFileDropover" @dragleave.prevent="onFileDropleave"
            @drop.prevent="onFileDrop" :class="{ over: isOver }">
            <form style="width: 100%;">
                <label for="file-reader" class="file-reader-label">{{ labeltext }}</label>
                <input id="file-reader" type="file" name="file-reader" class="file-reader-input" @change="onFileChange"
                    :disabled="loading" ref="fileref" />
            </form>
        </div>
        <div style="display: flex;align-items: center;padding-left: 10px;">
            <Spinners v-if="loading" width="20px" height="20px"></Spinners>
        </div>
        <div style="display: flex;align-items: center;padding-left: 10px;">
            <Button @click="clearFile" v-if="hasFile && !loading" Tip="clear file" :Disabled="loading">
                <Close></Close>
            </Button>
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

.over {
    background-color: var(--color-background-mute);
}
</style>