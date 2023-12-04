
<script lang="ts" setup>
import { ref, PropType, computed, watchEffect, watch } from 'vue'
import { computedAsync } from '@vueuse/core'
import * as pdfjsLib from 'pdfjs-dist'
import Moveable from "vue3-moveable"

import { jsPDF } from 'jspdf'
import { imageBitmapToCanvas } from '@/tools/util'

import Spinners from '@/components/Spinners.vue'
import Button from '@/components/Button.vue'
import Draggable from '@/components/Draggable.vue'

pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.REACT_APP_PDFJS_CDN + pdfjsLib.version}/pdf.worker.mjs`

const loading = ref(false)
const subloading = ref(false)
const pdfRaw = ref<pdfjsLib.PDFDocumentLoadingTask>()
const currentPage = ref(0)
const totalPages = ref(1)
const showText = ref(false)
const fillHeight = ref(true)

let outputScale = ref(3)
let viewerScale = ref(1)

const pageContent = ref<Record<string, string>>({})
let pagePrefix = ""
const zoomStep = 0.1

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target == null || target.files == null || target.files.length == 0 || !target.files[0]) {
        return
    }

    const file = target.files[0]
    const extension = file.name.split('.')[1]
    pagePrefix = file.name.split('.')[0]

    if (extension !== 'pdf') {
        alert('Please select a PDF file')
        return
    }

    const reader = new FileReader()

    reader.onload = async () => {
        const dataUrl = reader.result
        if (dataUrl) {
            loading.value = true
            await extractDataFromPdf(dataUrl)
            loading.value = false
            currentPage.value = 1
        }
    }

    reader.readAsDataURL(file)
}

const extractedText = ref("")

watchEffect(async () => {
    if (loading.value) {
        return
    }

    subloading.value = true
    const text = pageContent.value[pagePrefix + currentPage.value]
    if (text) {
        extractedText.value = text
    } else {
        extractedText.value = ""
    }

    subloading.value = false
})

watch(
    () => [currentPage, pdfRaw],
    async () => {
        if (!pdfRaw.value || subloading.value || loading.value) {
            return
        }

        subloading.value = true
        const pdf = await pdfRaw.value.promise
        await readPDFRawPage(pdf, currentPage.value)
        subloading.value = false
    },
    { deep: true }
)

watch(fillHeight, () => {
    viewerScale.value = 1
    let canvas = document.getElementById("canvas") as HTMLCanvasElement
    const parentNode = canvas.parentElement!
    if (fillHeight.value) {
        const clientHeight = parentNode.clientHeight
        const scaleWidth = canvas.width / canvas.height * clientHeight
        canvas.style.width = Math.floor(scaleWidth) + "px"
        canvas.style.height = Math.floor(clientHeight) + "px"
    } else {
        const clientWidth = parentNode.clientWidth
        const scaleHeight = canvas.height / canvas.width * clientWidth
        canvas.style.width = Math.floor(clientWidth) + "px"
        canvas.style.height = Math.floor(scaleHeight) + "px"
    }
})

const onPdfViewWheel = async (e: WheelEvent) => {
    if (e.deltaY < 0) {
        await changeSize(zoomStep)
    } else {
        await changeSize(-zoomStep)
    }
}

const readPDFRawPage = async (pdf: pdfjsLib.PDFDocumentProxy, pageNumber: number) => {
    const maxPages = pdf.numPages
    if (pageNumber > maxPages) {
        pageNumber = maxPages
    }
    if (pageNumber < 1) {
        pageNumber = 1
    }

    const page = await pdf.getPage(pageNumber)
    const viewport = page.getViewport({ scale: outputScale.value, rotation: 0 })

    // init value
    let canvas = document.getElementById("canvas") as HTMLCanvasElement
    if (viewerScale.value == 1) {
        if (fillHeight.value) {
            const clientHeight = canvas.clientHeight
            const scaleWidth = viewport.width / viewport.height * clientHeight
            canvas.style.width = Math.floor(scaleWidth) + "px"
            canvas.style.height = Math.floor(clientHeight) + "px"
        } else {
            const clientWidth = canvas.clientWidth
            const scaleHeight = viewport.height / viewport.width * clientWidth
            canvas.style.width = Math.floor(clientWidth) + "px"
            canvas.style.height = Math.floor(scaleHeight) + "px"
        }
    } else {
        canvas = scalePdfViewer()
    }

    canvas.width = Math.floor(viewport.width * outputScale.value)
    canvas.height = Math.floor(viewport.height * outputScale.value)

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    const transform = outputScale.value !== 1 ? [outputScale.value, 0, 0, outputScale.value, 0, 0] as any[] : undefined
    await page.render({ canvasContext: ctx, transform, viewport, }).promise
}

const readAllTextContent = async (pdf: pdfjsLib.PDFDocumentProxy) => {
    const maxPages = totalPages.value
    pageContent.value = {}
    for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()

        let pageTextContent = ""
        for (let ii = 0; ii < content.items.length; ii++) {
            const element = content.items[ii]
            if ('str' in element) {
                pageTextContent += element.str
                if (element.hasEOL) {
                    pageTextContent += "\n"
                }
            } else {
                console.log(element)
            }
        }

        pageContent.value[pagePrefix + i] = pageTextContent
    }
}

const changePage = (i: number) => {
    const maxPages = totalPages.value
    let pageNumber = currentPage.value + i
    if (pageNumber > maxPages) {
        pageNumber = maxPages
    }
    if (pageNumber < 1) {
        pageNumber = 1
    }
    currentPage.value = pageNumber
}

const onCurrentPageChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target == null) {
        return
    }

    const maxPages = totalPages.value
    let pageNumber = parseInt(target.value)
    if (pageNumber > maxPages) {
        pageNumber = maxPages
    }
    if (pageNumber < 1) {
        pageNumber = 1
    }
    currentPage.value = pageNumber
}

const changeSize = async (i: number) => {
    if (!pdfRaw.value || subloading.value) {
        return
    }

    viewerScale.value = 1 + i
    scalePdfViewer()
}

const scalePdfViewer = () => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement
    let width = parseFloat(canvas.style.width) * viewerScale.value
    let height = parseFloat(canvas.style.height) * viewerScale.value
    canvas.style.width = (width) + "px"
    canvas.style.height = (height) + "px"
    return canvas
}

const extractDataFromPdf = async (url: string | ArrayBuffer) => {
    const pdfTask = pdfjsLib.getDocument(url)
    pdfRaw.value = pdfTask
    const pdf = await pdfTask.promise
    totalPages.value = pdf.numPages
    await readAllTextContent(pdf)
}

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
// }

</script>

<template>
    <div class="full-content">
        <div class="header">
            <div class="header-option-group">
                <div style="flex:1">
                    <form>
                        <input type="file" @change="onFileChange" :disabled="loading" />
                    </form>
                </div>
                <div style="display: flex;align-items: center;padding-left: 10px;">
                    <Spinners v-if="loading" width="20px" height="20px"></Spinners>
                </div>
            </div>
            <div class="header-option-group" style="justify-content: center;">
                <div>
                    <input type="number" min="1" :max="totalPages" :value="currentPage" @change="onCurrentPageChange"
                        :disabled="loading" />
                </div>
                <div>
                    <label style="line-height: 32px;">/ totals : {{ totalPages }}</label>
                </div>
            </div>
            <div class="header-option-group">
                <div>
                    <Button Text="Prev" :IsLoading="subloading" @click="changePage(-1)" :Disabled="loading">
                    </Button>
                </div>
                <div>
                    <Button Text="Next" :IsLoading="subloading" @click="changePage(1)" :Disabled="loading">
                    </Button>
                </div>
                <div>
                    <Button :Text="fillHeight ? 'FillWidth' : 'FillHeight'" :Disabled="subloading"
                        @click="() => fillHeight = !fillHeight">
                    </Button>
                </div>
            </div>
            <div class="header-option-group">
                <div>
                    <Button Text="ZoomOut" :Disabled="subloading" @click="changeSize(zoomStep)">
                    </Button>
                </div>
                <div>
                    <Button Text="ZoomIn" :Disabled="subloading" @click="changeSize(-zoomStep)">
                    </Button>
                </div>
                <div>
                    <Button :Text="!showText ? 'ShowText' : 'HideText'" :Disabled="subloading"
                        @click="() => showText = !showText">
                    </Button>
                </div>
            </div>
        </div>
        <div class="pdf-page-container">
            <div class="pdf-page" id="area" @wheel="onPdfViewWheel">
                <div class="target">
                    <canvas id="canvas"></canvas>
                </div>
                <Draggable selector=".target"></Draggable>
            </div>
            <div class="pdf-page" v-if="showText">
                <textarea v-model="extractedText" placeholder="" v-if="!loading" class="text-input"></textarea>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
.full-content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    grid-gap: 10px;
}

.header {
    display: flex;
    flex-direction: row;
    width: 100%;
    grid-gap: 10px;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
}

.header-option-group {
    display: flex;
    flex-direction: row;
    flex: 1;
    grid-gap: 10px;
}

.header-option-group div form {
    width: 100%;
}

.header-option-group div form input {
    width: 100%;
    margin-left: 10px;
    white-space: nowrap;
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
    overflow: hidden;
    position: relative;
}

.target {
    height: 100%;
    width: 100%;
}

#canvas {
    height: 100%;
    width: 100%;
}

.text-input {
    border: none;
    border-radius: 0;
    padding: 0;
}
</style>