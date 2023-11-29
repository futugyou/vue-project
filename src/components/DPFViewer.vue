
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
        if (fns[i] !== pdfjsLib.OPS.paintImageXObject) { return; }

        console.log('loading', i, arg)

        const imgKey = arg[0]

        page.objs.get(imgKey, async (img: any) => {
            console.log('image', img)
            // const viewport = page.getViewport({ scale: 1.0, rotation: 0 })
            let canvas = document.createElement(imgKey);
            canvas.id = imgKey;

            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            ctx.drawImage(img.bitmap, 0, 0)
            // await page.render({
            //     canvasContext: ctx,
            //     viewport
            // }).promise;
            const rootElement = document.getElementById('area') as HTMLElement;
            rootElement.appendChild(canvas);
            const doc = new jsPDF();

            doc.text("Hello world!", 10, 10);
            doc.addImage({ imageData: canvas, x: 0, y: 0, width: img.width, height: img.height })
            doc.save("a4.pdf");
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