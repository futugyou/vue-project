<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue'
import { UrlParameters } from './types'
import { getEmbedUrl, handleEvent } from './utils'

import { useEventListener } from '@/composables/event'

export interface IEmbedDrawioProps {
    baseUrl?: string,
    urlParameters?: UrlParameters,
    configuration?: { [key: string]: any }
}

const props = defineProps<IEmbedDrawioProps>()
const iframeUrl = ref(getEmbedUrl(props.baseUrl, props.urlParameters, !!props.configuration))

const iframeRef = ref<HTMLIFrameElement>()
const messageHandler = (evt: MessageEvent) => {
    handleEvent(
        evt,
        {
            init: (data) => {
                iframeRef.value?.contentWindow?.postMessage(
                    JSON.stringify({ action: 'load', xml: '' }),
                    '*'
                )
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
        },
        props.baseUrl,
    )
}

useEventListener(window, 'message', messageHandler)
</script>

<template>
    <iframe className="diagrams-iframe" ref="iframeRef" :src="iframeUrl" title="Diagrams.net" />
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
