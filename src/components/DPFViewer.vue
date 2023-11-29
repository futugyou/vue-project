
<script lang="ts" setup>
import { ref, PropType, computed } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.REACT_APP_PDFJS_CDN + pdfjsLib.version}/pdf.worker.mjs`

const extractedText = ref("")
const loading = ref(false)

const onFileChange = (event: any) => {
    console.log(event)
    const file = event.target.files[0]
    const extension = file.name.split('.').pop()

    if (extension !== 'pdf') {
        alert('Please select a PDF file')
        return
    }

    const reader = new FileReader()

    reader.onload = async () => {
        const dataUrl = reader.result
        if (dataUrl) {
            loading.value = true

            const text = await extractTextFromPdf(dataUrl)
            extractedText.value = text

            loading.value = false
        }
    }

    reader.readAsDataURL(file)
}

const extractTextFromPdf = async (url: string | ArrayBuffer) => {
    const pdfTask = pdfjsLib.getDocument(url)
    const pdf = await pdfTask.promise
    const maxPages = pdf.numPages
    let textContent = []

    for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageTextContent = content.items.map((item: any) => item.str ?? "").join('')
        textContent.push(pageTextContent)
    }

    return textContent.join('\n')
}
</script>

<template>
    <div>
        <form>
            <input type="file" ref="pdfFile" @change="onFileChange">
        </form>
        <pre v-if="!loading" v-html="extractedText"></pre>
        <div v-if="loading">Processing PDF...</div>
    </div>
</template>
  
<style></style>