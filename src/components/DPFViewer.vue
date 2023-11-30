
<script lang="ts" setup>
import { ref, PropType, computed } from 'vue'
import { computedAsync } from '@vueuse/core'
import * as pdfjsLib from 'pdfjs-dist'

import { jsPDF } from 'jspdf'
import { imageBitmapToCanvas } from '@/tools/util'

import Spinners from '@/components/Spinners.vue'

pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.REACT_APP_PDFJS_CDN + pdfjsLib.version}/pdf.worker.mjs`

const loading = ref(false)
const pdfRaw = ref<pdfjsLib.PDFDocumentLoadingTask>()
const currentPage = ref(34)

const onFileChange = (event: any) => {
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
            await extractTextFromPdf(dataUrl)
            loading.value = false
        }
    }

    reader.readAsDataURL(file)
}

const extractedText = computedAsync(async () => {
    if (!pdfRaw.value) {
        return ""
    }

    const pdf = await pdfRaw.value.promise
    await readPDFRawPage(pdf, currentPage.value)
    return await readTextContent(pdf, currentPage.value)
})

const readPDFRawPage = async (pdf: pdfjsLib.PDFDocumentProxy, pageNumber: number) => {
    const maxPages = pdf.numPages
    if (pageNumber > maxPages) {
        pageNumber = maxPages
    }
    if (pageNumber < 1) {
        pageNumber = 1
    }

    const page = await pdf.getPage(pageNumber)
    const viewport = page.getViewport({ scale: 1.0, rotation: 0 })
    const visibleCanvas = document.createElement('canvas')
    const view = page.view
    visibleCanvas.id = page.pageNumber + ""
    visibleCanvas.width = Math.floor(viewport.width)
    visibleCanvas.height = Math.floor(viewport.height)
    // visibleCanvas.style.width = "100%"
    visibleCanvas.style.height = "100%"
    const ctx = visibleCanvas.getContext("2d") as CanvasRenderingContext2D

    await page.render({
        canvasContext: ctx,
        viewport
    }).promise

    const rootElement = document.getElementById('area') as HTMLElement
    rootElement.replaceChildren(visibleCanvas)
}

const readTextContent = async (pdf: pdfjsLib.PDFDocumentProxy, pageNumber: number) => {
    const maxPages = pdf.numPages
    if (pageNumber > maxPages) {
        pageNumber = maxPages
    }
    if (pageNumber < 1) {
        pageNumber = 1
    }

    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()

    let pageTextContent = ""
    for (let ii = 0; ii < content.items.length; ii++) {
        const element = content.items[ii]
        if ('str' in element) {
            pageTextContent += element.str
            // if (element.hasEOL) {
            //     pageTextContent += "\n"
            // }
        } else {
            console.log(element)
        }
    }

    const m = pageTextContent.match(/[^.]+/g)
    if (m) {
        return m.join('\n')
    }

    return pageTextContent
}

const extractTextFromPdf = async (url: string | ArrayBuffer) => {
    const pdfTask = pdfjsLib.getDocument(url)
    pdfRaw.value = pdfTask

    // const pdfTask = pdfjsLib.getDocument(url)
    // const pdf = await pdfTask.promise
    // let textContent = []
    // const maxPages = pdf.numPages
    // for (let i = 1; i <= maxPages; i++) {
    //     const page = await pdf.getPage(i)
    //     const operatorList = await page.getOperatorList()
    //     const fns = operatorList.fnArray
    //     const args = operatorList.argsArray
    //     args.forEach((arg, i) => {
    //         if (fns[i] !== pdfjsLib.OPS.paintImageXObject) { return }
    //         const imgKey = arg[0]

    //         page.objs.get(imgKey, async (img: any) => {
    //             const canvas = await imageBitmapToCanvas(img.bitmap)
    //             const rootElement = document.getElementById('area') as HTMLElement
    //             rootElement.replaceChildren(canvas)

    //             const doc = new jsPDF({ unit: 'px', hotfixes: ["px_scaling"], format: "a4", orientation: "portrait" })
    //             const pageWidth = doc.internal.pageSize.getWidth()
    //             console.log(pageWidth, img.width)
    //             const a = pageWidth * 0.88
    //             const b = pageWidth * 0.88 / img.width * img.height
    //             doc.text("Hello world!", 10, 10)
    //             doc.addImage({ imageData: canvas, x: pageWidth * 0.06, y: 20, width: a, height: b })
    //             doc.save("a4.pdf")
    //         })
    //     })
    // }
}
</script>

<template>
    <div class="full-content">
        <div>
            <form>
                <input type="file" ref="pdfFile" @change="onFileChange">
            </form>
        </div>
        <div class="pdf-page-container">
            <Spinners v-if="loading"></Spinners>
            <div class="pdf-page">
                <div id="area" style="width: 100%;height: 100%;"></div>
            </div>
            <div class="pdf-page">
                <textarea v-model="extractedText" placeholder="" v-if="!loading" class="text-input"></textarea>
            </div>
        </div>
    </div>
</template>
  
<style>
.full-content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.pdf-page-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    grid-gap: 10px;
}

.pdf-page {
    flex: 1;
    padding: 10px;
    border: 1px solid var(--color-border-text-normal-default);
    border-radius: 10px;
}

.text-input {
    border: none;
    border-radius: 0;
    padding: 0;
}
</style>