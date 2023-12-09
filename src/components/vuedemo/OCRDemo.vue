<script setup lang="ts">
import { createWorker } from 'tesseract.js'
import { ref, computed, onMounted, onUnmounted } from 'vue'

import FileInput from '@/common/FileInput.vue'
import Scan from '@/icons/Scan.vue'
import Button from '@/common/Button.vue'

let ocrWorker: Tesseract.Worker | undefined

const textList = ref<string[]>([])
const imageList = ref<string[]>([])
const loading = ref(false)
const hasImage = ref(false)
const fileref = ref<FileList>()

const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/pbm']

const onFileChange = async (fileList: FileList) => {
    clear()
    if (!fileList || !ocrWorker || fileList.length == 0) {
        return
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

const transform = async () => {
    textList.value = []
    if (!fileref.value || !ocrWorker) {
        return
    }

    loading.value = true
    for (let i = 0; i < fileref.value.length; i++) {
        const file = fileref.value[i]
        const { data: { text } } = await ocrWorker.recognize(file, {
            rotateAuto: true,
        })
        textList.value.push(text)
    }

    loading.value = false
}

const clear = () => {
    hasImage.value = false
    fileref.value = undefined
    imageList.value = []
    textList.value = []
}

onMounted(async () => {
    ocrWorker = await createWorker(undefined, undefined)
})

onUnmounted(async () => {
    if (ocrWorker) {
        await ocrWorker.terminate()
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
    grid-template-columns: repeat(2, 1fr);
    grid-gap: var(--grid-gap-10);
}

.text-container {
    flex: 1;
    display: grid;
    height: 100%;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: var(--grid-gap-10);
}
</style>  