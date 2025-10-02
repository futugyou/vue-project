<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'

import Spinners from '@/common/Spinners.vue'
import Close from '@/icons/Close.vue'
import Button from '@/common/Button.vue'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const props = defineProps<{
    IsLoading?: boolean
    Accept?: string
    Multiple?: boolean
}>()

const labeltext = ref("choose file")
const isOver = ref(false)
const hasFile = ref(false)
const fileref = ref<HTMLInputElement>()

const emit = defineEmits<{
    (e: 'fileLoad', f: FileList): void
    (e: 'clear'): void
}>()

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target == null || target.files == null || target.files.length == 0) {
        labeltext.value = "choose or drag a file"
        hasFile.value = false
        return
    }

    handlerFile(target.files)
}

const onFileDrop = (event: DragEvent) => {
    if (!event.dataTransfer) {
        labeltext.value = "choose or drag a file"
        return
    }

    handlerFile(event.dataTransfer.files)
}

const handlerFile = (fileList: FileList) => {
    let labels: string[] = []
    if (Accept.value && Accept.value != "*") {
        const supportedMimeTypes = Accept.value.split(",")
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i]!
            if (!supportedMimeTypes.includes(file.type)) {
                msg.value = {
                    errorMessages: ["file type Must " + Accept.value],
                    delay: 3000,
                }
                return
            }
            labels.push(file.name)
        }
    } else {
        Array.from(fileList).map((file) => { labels.push(file.name) })
    }

    labeltext.value = labels.join(",")
    emit('fileLoad', fileList)
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
        fileref.value.value = ""
        labeltext.value = "choose or drag a file"
        hasFile.value = false
        emit('clear')
    }
}

const Accept = computed(() => {
    if (!props.Accept) {
        return "*"
    }

    return props.Accept
})

onMounted(() => {
    labeltext.value = "choose or drag a file"
    hasFile.value = false
})

</script>

<template>
    <div class="file-container">
        <div style="width: 100%;overflow: hidden;" @dragover.prevent="onFileDropover" @dragleave.prevent="onFileDropleave"
            @drop.prevent="onFileDrop" :class="{ over: isOver }">
            <form>
                <label for="file-reader" class="file-reader-label">{{ labeltext }}</label>
                <input flag id="file-reader" type="file" name="file-reader" :multiple="Multiple" class="file-reader-input"
                    @change="onFileChange" :disabled="IsLoading" ref="fileref" :accept="Accept" />
            </form>
        </div>
        <div class="file-cancel">
            <Button @click="clearFile" v-if="hasFile && !IsLoading" Tip="clear file" :Disabled="IsLoading">
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
    position: relative;
    overflow: hidden;
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
    padding-block: 0 !important;
    padding-inline: 0 !important;
    line-height: 0 !important;
    border: 0 !important;
    display: inline;
}

.over {
    background-color: var(--color-background-mute);
}

.file-cancel {
    position: absolute;
    right: 10px;
    top: 8px;
    overflow: hidden;
}
</style>