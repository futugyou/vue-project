
<script lang="ts" setup>
import { ref, PropType, computed } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import { jsPDF } from 'jspdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = `${import.meta.env.REACT_APP_PDFJS_CDN + pdfjsLib.version}/pdf.worker.mjs`

const extractedText = ref("")
const loading = ref(false)

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

            const text = await extractTextFromPdf(dataUrl)
            extractedText.value = text

            loading.value = false
        }
    }

    reader.readAsDataURL(file)
}

const imageBitmapToCanvas = async (imageBitmap: ImageBitmap): Promise<HTMLCanvasElement> => {
    // Create an offscreen canvas
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height)
    const offscreenContext = canvas.getContext('2d')

    // Draw the ImageBitmap onto the offscreen canvas
    offscreenContext?.drawImage(imageBitmap, 0, 0)

    // Create a visible canvas
    const visibleCanvas = document.createElement('canvas')
    visibleCanvas.width = imageBitmap.width;
    visibleCanvas.height = imageBitmap.height;

    // Get the rendering context for the visible canvas
    const visibleContext = visibleCanvas.getContext('2d')!

    visibleContext.drawImage(canvas, 0, 0)

    return visibleCanvas
}


const extractTextFromPdf = async (url: string | ArrayBuffer) => {
    const pdfTask = pdfjsLib.getDocument(url)
    const pdf = await pdfTask.promise
    const maxPages = pdf.numPages
    let textContent = []

    // for (let i = 1 i <= maxPages i++) {
    const page = await pdf.getPage(34)
    const ann = page._pageInfo
    console.log(ann)
    const operatorList = await page.getOperatorList()
    const fns = operatorList.fnArray
    const args = operatorList.argsArray
    console.log(args)
    args.forEach((arg, i) => {
        if (fns[i] !== pdfjsLib.OPS.paintImageXObject) { return }

        console.log('loading', i, arg)

        const imgKey = arg[0]

        page.objs.get(imgKey, async (img: any) => {
            const canvas = await imageBitmapToCanvas(img.bitmap)
            const rootElement = document.getElementById('area') as HTMLElement
            rootElement.appendChild(canvas)

            const doc = new jsPDF({ unit: 'px', hotfixes: ["px_scaling"], format: "a4", orientation: "portrait" })
            const pageWidth = doc.internal.pageSize.getWidth()
            console.log(pageWidth, img.width)
            const a = pageWidth * 0.88
            const b = pageWidth * 0.88 / img.width * img.height
            doc.text("Hello world!", 10, 10)
            doc.addImage({ imageData: canvas, x: pageWidth * 0.06, y: 20, width: a, height:b})
            doc.save("a4.pdf")
        })
    })

    const content = await page.getTextContent()
    const pageTextContent = content.items.map((item: any) => item.str ?? "").join('').match(/[^.]+/g)!.join('\n')
    textContent.push(pageTextContent)
    // }

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
        <div id="area"> </div>
    </div>
</template>
  
<style></style>