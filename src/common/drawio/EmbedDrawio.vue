<script lang="ts" setup>
import { ref, watch, watchEffect, computed } from 'vue'
import { MergeEvent, UrlParameters } from './types'
import { getEmbedUrl, handleEvent } from './utils'

import { useEventListener } from '@/composables/event'
import { drawAction } from './action'

export interface IEmbedDrawioProps {
    xml?: string
    baseUrl?: string,
    urlParameters?: UrlParameters,
    configuration?: { [key: string]: any }
    autosave?: boolean
    title?: string
    onMerge?: (e: MergeEvent) => void
}

const props = defineProps<IEmbedDrawioProps>()
const parser = new DOMParser()
const xml = ref(props.xml ?? "")
const xmlNode = computed(() => parser.parseFromString(xml.value, "application/xml"))
const iframeUrl = ref(getEmbedUrl(props.baseUrl, props.urlParameters, !!props.configuration))

const iframeRef = ref<HTMLIFrameElement>()
const messageHandler = (evt: MessageEvent) => {
    handleEvent(
        evt,
        {
            init: (data) => {
                drawAction(iframeRef, "load", {
                    xml: props.xml, autosave: props.autosave == false ? 0 : 1, title: props.title ?? "",
                })
            },
            configure: (data) => {
                if (!!props.configuration) {
                    drawAction(iframeRef, "configure", { config: props.configuration })
                }
            },
            autosave: (data) => {
                console.log(data)
            },
            load: (data) => {
                console.log(data)
            },
            openLink: (data) => {
                console.log(data)
            },
            exit: (data) => {
                console.log(data)
            },
            save: (data) => {
                console.log(data)
            },
            merge: (data) => {
                if (props.onMerge) {
                    props.onMerge(data)
                }
            },
            prompt: (data) => {
                console.log(data)
            },
            template: (data) => {
                console.log(data)
            },
            draft: (data) => {
                console.log(data)
            },
            export: (data) => {
                console.log(data)
            },
        },
        props.baseUrl,
    )
}

const merge = (xml: string) => {
    drawAction(iframeRef, "merge", { xml: xml })
}

useEventListener(window, 'message', messageHandler)

defineExpose({
    merge: merge,
})
</script>

<template>
    <iframe className="diagrams-iframe" ref="iframeRef" :src="iframeUrl" />
</template>

<style scoped  lang="scss">
iframe {
    width: 100%;
    height: 100%;
    min-width: 400px;
    min-height: 400px;
    border: none;
}
</style>
