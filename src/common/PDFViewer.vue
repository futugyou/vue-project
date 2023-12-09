
<script lang="ts" setup>
import { ref, PropType, computed, watchEffect, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { computedAsync } from '@vueuse/core'
import * as pdfjsLib from 'pdfjs-dist'
import Moveable from "vue3-moveable"

import { jsPDF } from 'jspdf'
import { imageBitmapToCanvas } from '@/tools/util'

import Spinners from '@/common/Spinners.vue'
import Button from '@/common/Button.vue'
import FileInput from '@/common/FileInput.vue'
import ZoomOut from '@/icons/ZoomOut.vue'
import ZoomIn from '@/icons/ZoomIn.vue'
import ZoomFit from '@/icons/ZoomFit.vue'
import Prev from '@/icons/Prev.vue'
import Next from '@/icons/Next.vue'
import Contact from '@/icons/Contact.vue'
import Draggable from '@/common/Draggable.vue'

pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.REACT_APP_PDFJS_CDN + pdfjsLib.version}/pdf.worker.mjs`

interface pdfinfo {
    name: string
    page: number
}

interface pagecontextinfo {
    page: number
    rawText: string
    text: string
}

const loading = ref(false)
const subloading = ref(false)
const pdfRaw = ref<pdfjsLib.PDFDocumentLoadingTask>()
const currentPage = ref(0)
let totalPages: number = 1
const showText = ref(false)
const fillHeight = ref(true)
const pdfinfo = useLocalStorage<pdfinfo[]>('pdfinfo', [])

let outputScale = ref(3)
let viewerScale = ref(1)

let pagePrefix = ref("")
const zoomStep = 0.1

const onFileChange = (fileList: FileList) => {
    if (!fileList || fileList.length == 0) {
        return
    }
    
    const file = fileList[0]
    const extension = file.name.split('.')[1]
    pagePrefix.value = file.name.split('.')[0]

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
            let storagePdf = pdfinfo.value.find(p => p.name == pagePrefix.value)
            if (storagePdf) {
                currentPage.value = storagePdf.page
            } else {
                pdfinfo.value.push({ name: pagePrefix.value, page: 1 })
                currentPage.value = 1
            }
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

    const pagecontextinfos = useLocalStorage<pagecontextinfo[]>(pagePrefix.value, [])
    const pagecontextinfo = pagecontextinfos.value.find(p => p.page == currentPage.value)
    if (pagecontextinfo) {
        extractedText.value = pagecontextinfo.text
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
    if (!canvas.style.width) {
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
    const pagecontextinfos = useLocalStorage<pagecontextinfo[]>(pagePrefix.value, [])

    if (pagecontextinfos.value.length == totalPages) {
        return
    }

    const pages: pagecontextinfo[] = []
    for (let i = 1; i <= totalPages; i++) {
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

        pages.push({ page: i, rawText: pageTextContent, text: pageTextContent })
    }

    pagecontextinfos.value = pages
}

const changePage = (i: number) => {
    let pageNumber = currentPage.value + i
    if (pageNumber > totalPages) {
        pageNumber = totalPages
    }
    if (pageNumber < 1) {
        pageNumber = 1
    }
    currentPage.value = pageNumber

    let storagePdf = pdfinfo.value.find(p => p.name == pagePrefix.value)
    if (storagePdf) {
        storagePdf.page = pageNumber
    } else {
        pdfinfo.value.push({ name: pagePrefix.value, page: 1 })
    }
}

const onCurrentPageChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target == null) {
        return
    }

    let pageNumber = parseInt(target.value)
    if (pageNumber > totalPages) {
        pageNumber = totalPages
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
    totalPages = pdf.numPages
    await readAllTextContent(pdf)
}

const changePdfText = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target == null) {
        return
    }

    const pagecontextinfos = useLocalStorage<pagecontextinfo[]>(pagePrefix.value, [])
    const pagecontextinfo = pagecontextinfos.value.find(p => p.page == currentPage.value)
    if (pagecontextinfo) {
        pagecontextinfo.text = target.value
    }
}

defineExpose({
    pagecontextkey: pagePrefix,
    currentPage: currentPage,
    extractedText,
})
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
                <FileInput @fileLoad="onFileChange" :IsLoading=loading Accept="application/pdf,.pdf"></FileInput>
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
                    <Button Tip="Prev" :IsLoading="subloading" @click="changePage(-1)" :Disabled="loading">
                        <Prev></Prev>
                    </Button>
                </div>
                <div>
                    <Button Tip="Next" :IsLoading="subloading" @click="changePage(1)" :Disabled="loading">
                        <Next></Next>
                    </Button>
                </div>
                <div>
                    <Button :Tip="fillHeight ? 'FillWidth' : 'FillHeight'" :Disabled="subloading"
                        @click="() => fillHeight = !fillHeight">
                        <ZoomFit></ZoomFit>
                    </Button>
                </div>
            </div>
            <div class="header-option-group">
                <div>
                    <Button Tip="ZoomIn" :Disabled="subloading" @click="changeSize(zoomStep)">
                        <ZoomIn></ZoomIn>
                    </Button>
                </div>
                <div>
                    <Button Tip="ZoomOut" :Disabled="subloading" @click="changeSize(-zoomStep)">
                        <ZoomOut></ZoomOut>
                    </Button>
                </div>
                <div>
                    <Button :Tip="!showText ? 'ShowText' : 'HideText'" :Disabled="subloading"
                        @click="() => showText = !showText">
                        <Contact> </Contact>
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
                <textarea :value="extractedText" @input="changePdfText" placeholder="" v-if="!loading"
                    class="text-input"></textarea>
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
    grid-gap: var(--grid-gap-10);
}

.header {
    display: flex;
    flex-direction: row;
    width: 100%;
    grid-gap: var(--grid-gap-10);
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
}

.header-option-group {
    display: flex;
    flex-direction: row;
    flex: 1;
    grid-gap: var(--grid-gap-10);
}

.pdf-page-container {
    height: calc(100% - 32px - 10px);
    width: 100%;
    display: flex;
    flex-direction: row;
    grid-gap: var(--grid-gap-10);
}

.pdf-page {
    flex: 1;
    padding: 10px;
    border: 1px solid var(--color-border-text-normal-default);
    border-radius: var(--border-radius-container);
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