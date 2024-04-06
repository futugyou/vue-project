<script setup lang="ts">

import { ref } from 'vue'
import SimpleButton from '@/common/SimpleButton.vue'
import EmbedDrawio, { MergeEvent } from '@/common/drawio'

const drawioRef = ref<InstanceType<typeof EmbedDrawio> | null>(null)
const urlParameters: any = {
    ui: 'kennedy',
    spin: true,
    libraries: true,
    saveAndExit: true
}

const xml = "<mxfile host=\"embed.diagrams.net\" modified=\"2024-04-05T12:54:43.216Z\" agent=\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\" version=\"24.2.2\" etag=\"1kUC4hc4U8UfDh9LfYwQ\" type=\"embed\">\n  <diagram id=\"a6zPMS5o3yZ-kPEKdHFb\" name=\"第 1 页\">\n    <mxGraphModel dx=\"1657\" dy=\"780\" grid=\"1\" gridSize=\"10\" guides=\"1\" tooltips=\"1\" connect=\"1\" arrows=\"1\" fold=\"1\" page=\"1\" pageScale=\"1\" pageWidth=\"827\" pageHeight=\"1169\" math=\"0\" shadow=\"0\">\n      <root>\n<mxCell id=\"0\" />\n<mxCell id=\"1\" parent=\"0\" />\n<mxCell id=\"2\" value=\"\" style=\"rounded=0;whiteSpace=wrap;html=1;\" vertex=\"1\" parent=\"1\">\n  <mxGeometry x=\"350\" y=\"370\" width=\"120\" height=\"60\" as=\"geometry\" />\n</mxCell>\n      </root>\n    </mxGraphModel>\n  </diagram>\n</mxfile>\n"

const config: any = { defaultFonts: ["Humor Sans"] }

const merge = () => {
    drawioRef.value?.merge("<mxCell id=\"3\" value=\"\" style=\"rounded=1;whiteSpace=wrap;html=1;\" vertex=\"1\" parent=\"1\">\n  <mxGeometry x=\"350\" y=\"360\" width=\"120\" height=\"60\" as=\"geometry\" />\n</mxCell>\n")
}

const dialog = () => {
    drawioRef.value?.dialog("title!", "message!", "ok", false)
}

const handleMerge = (e: MergeEvent) => {
    console.log(e)
}
</script>

<template>
    <div class="drawio-demo">
        <div class="header">
            <SimpleButton Text="Merge" @click="merge">
            </SimpleButton>
            <SimpleButton Text="Dialog" @click="dialog">
            </SimpleButton>
        </div>
        <div class="body">
            <EmbedDrawio ref="drawioRef" :urlParameters="urlParameters" :xml="xml" :configuration="config"
                :onMerge="handleMerge"></EmbedDrawio>
        </div>
    </div>
</template>

<style scoped>
.drawio-demo {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    gap: 10px;
}

.header {
    display: flex;
    flex-direction: row;
    padding: 10px;
    padding-bottom: 0px;
}

.body {
    flex: 1;
}
</style>  