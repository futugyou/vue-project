<script setup lang="ts">
import { createWorker } from 'tesseract.js'
import { ref, computed, onMounted, onUnmounted } from 'vue'

let ocrWorker: Tesseract.Worker | undefined
const imageText = ref("")
onMounted(async () => {
    ocrWorker = await createWorker('eng')
    const ret = await ocrWorker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png')
    console.log(ret.data.text)
    imageText.value = ret.data.text
    await ocrWorker.terminate()
})

</script>

<template>
    <div><img src="https://tesseract.projectnaptha.com/img/eng_bw.png"></div>
    <div>
        {{ imageText }}
    </div>
</template>