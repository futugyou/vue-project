<script setup lang="ts">
import { createWorker } from 'tesseract.js'
import { ref, computed, onMounted, onUnmounted } from 'vue'

import FileInput from '@/common/FileInput.vue'
import Scan from '@/icons/Scan.vue'
import Button from '@/common/Button.vue'

let ocrWorker: Tesseract.Worker | undefined
const extractedText = ref("")
const extractedConfidence = ref(0)

const imagescr = ref("")
const loading = ref(false)
const hasImage = ref(false)
const fileref = ref<File>()
const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/pbm']

const onFileChange = async (fileList: FileList) => {
    hasImage.value = false
    fileref.value = undefined
    if (!fileList || !ocrWorker || fileList.length == 0) {
        return
    }

    //extension check 
    const file = fileList[0]
    loading.value = true
    const objectUrl = URL.createObjectURL(file)
    imagescr.value = objectUrl
    loading.value = false
    hasImage.value = true
    fileref.value = file
}

const transform = async () => {
    if (!fileref.value || !ocrWorker) {
        return
    }

    loading.value = true
    const { data: { text, confidence } } = await ocrWorker.recognize(fileref.value, {
        rotateAuto: true,
    })

    extractedText.value = text
    extractedConfidence.value = confidence
    loading.value = false
}

const clear = () => {
    hasImage.value = false
    fileref.value = undefined
    imagescr.value = ""
    extractedText.value = ""
    extractedConfidence.value = 0
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
    <div class="ocr-content">
        <div class="image-container">
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
            <div style="overflow: hidden; padding: 5px;">
                <img :src="imagescr">
            </div>
        </div>
        <div class="text-container">
            <textarea v-model="extractedText" placeholder=""></textarea>
            <span>{{ extractedConfidence }}</span>
        </div>
    </div>
</template>
<style scoped>
.ocr-content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    grid-gap: var(--grid-gap-10);
}

.ocr-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    grid-gap: var(--grid-gap-10);
}

.image-container {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.text-container {
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>  