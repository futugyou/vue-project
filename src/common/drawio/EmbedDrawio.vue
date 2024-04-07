<script lang="ts" setup>
import { ref, watch, watchEffect, computed } from 'vue'

import { useEventListener } from '@/composables/event'
import { DrawAction, LayoutType } from './action'
import { handleEvent, MergeEvent, PromptEvent, PromptCancelEvent, DraftEvent, LoadEvent, AutosaveEvent } from './event'
import { UrlParameters, getEmbedUrl } from './types'

export interface IEmbedDrawioProps {
    xml?: string
    baseUrl?: string,
    urlParameters?: UrlParameters,
    configuration?: { [key: string]: any }
    title?: string
    onLoad?: (e: LoadEvent) => void
    onAutosave?: (e: AutosaveEvent) => void
    onMerge?: (e: MergeEvent) => void
    onPrompt?: (e: PromptEvent) => void
    onPromptCancel?: (e: PromptCancelEvent) => void
    onDraft?: (e: DraftEvent) => void
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
                action.load(props.xml, true, props.title,)
            },
            configure: (data) => {
                if (!!props.configuration) {
                    action.configure(props.configuration)
                }
            },
            autosave: (data) => {
                if (props.onAutosave) {
                    props.onAutosave(data)
                }
            },
            load: (data) => {
                if (props.onLoad) {
                    props.onLoad(data)
                }
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
                // TODO: need merge xml to current
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
                if (data.message?.callback && data.xml) {
                    action.load(data.xml, true, props.title,)
                }
            },
            draft: (data) => {
                // TODO: need merge draft xml to current if result: 'edit'
                if (props.onDraft) {
                    props.onDraft(data)
                }
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

const template = (callback: boolean) => {
    action.template(callback)
}

const layout = (layout: LayoutType) => {
    action.layout({ layouts: [{ layout: layout }] })
}

const draft = (xml: string, name: string) => {
    action.draft({
        xml: xml,
        name: name,
        ignore: true,
    })
}

const status = (message: string, modified?: boolean) => {
    action.status({ message: message, modified: modified ?? false })
}

const spinner = (show: boolean, message?: string) => {
    action.spinner({ show: show, message: message })
}

useEventListener(window, 'message', messageHandler)

defineExpose({
    merge,
    dialog,
    prompt,
    template,
    layout,
    draft,
    status,
    spinner,
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
