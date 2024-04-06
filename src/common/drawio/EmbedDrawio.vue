<script lang="ts" setup>
import { ref, watch, watchEffect, computed } from 'vue'

import { useEventListener } from '@/composables/event'
import { DrawAction } from './action'
import { handleEvent, MergeEvent, PromptEvent, PromptCancelEvent } from './event'
import { UrlParameters, getEmbedUrl } from './types'

export interface IEmbedDrawioProps {
    xml?: string
    baseUrl?: string,
    urlParameters?: UrlParameters,
    configuration?: { [key: string]: any }
    autosave?: boolean
    title?: string
    onMerge?: (e: MergeEvent) => void
    onPrompt?: (e: PromptEvent) => void
    onPromptCancel?: (e: PromptCancelEvent) => void
}

const props = defineProps<IEmbedDrawioProps>()

const parser = new DOMParser()
const xml = ref(props.xml ?? "")
const xmlNode = computed(() => parser.parseFromString(xml.value, "application/xml"))

const iframeUrl = ref(getEmbedUrl(props.baseUrl, props.urlParameters, !!props.configuration))
const iframeRef = ref<HTMLIFrameElement>()

const action = new DrawAction(iframeRef)

const messageHandler = (evt: MessageEvent) => {
    handleEvent(
        evt,
        {
            init: (data) => {
                action.load(props.xml, props.autosave, props.title,)
            },
            configure: (data) => {
                if (!!props.configuration) {
                    action.configure(props.configuration)
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
                if (props.onPrompt) {
                    props.onPrompt(data)
                }
            },
            'prompt-cancel': (data) => {
                if (props.onPromptCancel) {
                    props.onPromptCancel(data)
                }
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
    action.merge(xml)
}

const dialog = (title: string, message: string, button: string, modified: boolean) => {
    action.dialog({
        title: title, message: message, button: button, modified: modified
    })
}

const prompt = (title: string, ok: string, defaultValue: string) => {
    action.prompt({
        title: title, ok: ok, defaultValue: defaultValue
    })
}

useEventListener(window, 'message', messageHandler)

defineExpose({
    merge,
    dialog,
    prompt,
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
