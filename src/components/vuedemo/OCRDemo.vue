<script setup lang="ts">
import { createWorker } from 'tesseract.js'
import { ref, computed, onMounted, onUnmounted } from 'vue'

import FileInput from '@/common/FileInput.vue'
import Operate from '@/icons/Operate.vue'
import Button from '@/common/Button.vue'

let ocrWorker: Tesseract.Worker | undefined
const extractedText = ref("")
const extractedConfidence = ref(0)

const imagescr = ref("")
const loading = ref(false)
const hasImage = ref(false)
const fileref = ref<File>()

const onFileChange = async (file: File) => {
    hasImage.value = false
    fileref.value = undefined
    if (!file || !ocrWorker) {
        return
    }

    //extension check 

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

    const { data: { text, confidence } } = await ocrWorker.recognize(fileref.value, {
        rotateAuto: true,
    })
    loading.value = true
    extractedText.value = text
    extractedConfidence.value = confidence
    await ocrWorker.terminate()
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

</script>

<template>
    <div class="ocr-content">
        <div class="image-container">
            <div class="ocr-header">
                <div style="flex: 2;">
                    <FileInput @fileLoad="onFileChange" :loading="loading" @clear="clear"></FileInput>
                </div>
                <div style="flex: 1;display: flex;justify-content: center;">
                    <Button @click="transform" v-if="fileref" :Disabled="loading" Tip="transform">
                        <Operate></Operate>
                    </Button>
                </div>
            </div>
            <div>
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