<script setup lang="ts">
import { createWorker } from 'tesseract.js'
import { ref, computed, onMounted, onUnmounted } from 'vue'

import FileInput from '@/common/FileInput.vue'

let ocrWorker: Tesseract.Worker | undefined
const extractedText = ref("")
const extractedConfidence = ref(0)

const imagescr = ref("")
const loading = ref(false)

const onFileChange = async (file: File) => {
    if (!file || !ocrWorker) {
        return
    }

    //extension check 

    loading.value = true
    const objectUrl = URL.createObjectURL(file)
    imagescr.value = objectUrl

    const { data: { text, confidence } } = await ocrWorker.recognize(file, {
        rotateAuto: true,
    })
    extractedText.value = text
    extractedConfidence.value = confidence
    await ocrWorker.terminate()
    loading.value = false
}

onMounted(async () => {
    ocrWorker = await createWorker(undefined, undefined)
})

</script>

<template>
    <div class="ocr-content">
        <div class="image-container">
            <FileInput @fileLoad="onFileChange" :loading=loading></FileInput>
            <div><img :src="imagescr"></div>
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