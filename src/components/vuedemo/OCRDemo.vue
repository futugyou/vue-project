<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { createScheduler, createWorker } from 'tesseract.js'

import FileInput from '@/common/FileInput.vue'
import Scan from '@/icons/Scan.vue'
import Button from '@/common/Button.vue'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'

const store = useMessageStore()
const { msg } = storeToRefs(store)

let scheduler: Tesseract.Scheduler | undefined

const textList = ref<string[]>([])
const imageList = ref<string[]>([])
const loading = ref(false)
const hasImage = ref(false)
const fileref = ref<FileList>()

const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/pbm']

const onFileChange = async (fileList: FileList) => {
    clear()
    if (!fileList || fileList.length == 0) {
        return
    }

    if (fileList.length > 4) {
        msg.value = {
            errorMessages: ["No more than 4 files."],
            delay: 3000,
        }
        return
    }

    if (fileList.length > 1) {
        theme.columns = 'repeat(2, 1fr)'
    } else {
        theme.columns = 'repeat(1, 1fr)'
    }

    loading.value = true
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        const objectUrl = URL.createObjectURL(file)
        imageList.value.push(objectUrl)
    }

    fileref.value = fileList
    loading.value = false
    hasImage.value = true
}

const workerGen = async () => {
    if (!scheduler) {
        return
    }
    const worker = await createWorker(undefined, undefined)
    scheduler.addWorker(worker)
}

const transform = async () => {
    textList.value = []
    if (!fileref.value || !scheduler) {
        return
    }

    loading.value = true
    const resArr = Array(fileref.value.length)
    for (let i = 0; i < fileref.value.length; i++) {
        resArr[i] = workerGen()
    }

    await Promise.all(resArr)

    let files: File[] = []
    for (let i = 0; i < fileref.value.length; i++) {
        files.push(fileref.value[i])
    }

    await Promise.all(files.map((file) => {
        if (!scheduler) {
            return
        }
        scheduler.addJob('recognize', file, { rotateAuto: true, })
            .then((x) => {
                textList.value.push(x.data.text)
            })
    }))

    loading.value = false
}

const theme = reactive({
    columns: 'repeat(1, 1fr)',
})

const clear = () => {
    hasImage.value = false
    fileref.value = undefined
    imageList.value = []
    textList.value = []
}

onMounted(async () => {
    scheduler = createScheduler()
})

onUnmounted(async () => {
    if (scheduler) {
        await scheduler.terminate()
    }
})
</script>

<template>
    <div class="ocr-container">
        <div class="ocr-header">
            <div style="flex: 2;">
                <FileInput @fileLoad="onFileChange" :IsLoading="loading" @clear="clear"
                    :Accept='supportedImageTypes.join(",")'></FileInput>
            </div>
            <div style="flex: 1;display: flex;justify-content: center;">
                <Button @click="transform" v-if="fileref" :Disabled="loading" Tip="transform">
                    <Scan></Scan>
                </Button>
            </div>
        </div>
        <div class="ocr-body">
            <div class="image-container">
                <div v-for="img in imageList" :key="img" style="overflow:hidden ;">
                    <img :src="img">
                </div>
            </div>
            <div class="text-container">
                <div v-for="text in textList" :key="text" style="overflow:hidden ;">
                    <textarea :value="text" placeholder=""></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.ocr-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    grid-gap: var(--grid-gap-10);
}

.ocr-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    grid-gap: var(--grid-gap-10);
}

.ocr-body {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    grid-gap: var(--grid-gap-10);
    overflow: hidden;
}

.image-container {
    flex: 1;
    display: grid;
    height: 100%;
    width: 100%;
    grid-template-columns: v-bind('theme.columns');
    grid-gap: var(--grid-gap-10);
}

.text-container {
    flex: 1;
    display: grid;
    height: 100%;
    width: 100%;
    grid-template-columns: v-bind('theme.columns');
    grid-gap: var(--grid-gap-10);
}
</style>  