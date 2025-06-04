<script lang="ts" setup>
import { ref, watch, watchEffect, computed, onMounted, onUnmounted } from 'vue'

import { useEventListener } from '@/composables/event'
import { DrawAction } from './action'
import type { ExportFromat, LayoutType } from './action'
import { handleEvent } from './event'
import type { MergeEvent, PromptEvent, PromptCancelEvent, DraftEvent, LoadEvent, AutosaveEvent, OpenLinkEvent, ExitEvent, ExportEvent } from './event'
import type { UrlParameters } from './types'
import { getEmbedUrl } from './types'

export interface IEmbedDrawioProps {
    xml?: string
    baseUrl?: string
    urlParameters?: UrlParameters
    configuration?: { [key: string]: any }
    title?: string
    format?: ExportFromat
    onLoad?: (e: LoadEvent) => void
    onAutosave?: (e: AutosaveEvent) => void
    onMerge?: (e: MergeEvent) => void
    onPrompt?: (e: PromptEvent) => void
    onPromptCancel?: (e: PromptCancelEvent) => void
    onDraft?: (e: DraftEvent) => void
    onOpenLink?: (e: OpenLinkEvent) => void
    onExit?: (e: ExitEvent) => void
    onSaveOrExport?: (e: ExportEvent) => void
}

const props = defineProps<IEmbedDrawioProps>()

const defaultUrlParameters: UrlParameters = {
    ui: 'kennedy',
    spin: true,
    libraries: true,
    saveAndExit: true,
    modified: false,
}

const defaultConfiguration: { [key: string]: any } = {
    defaultFonts: ['Humor Sans'],
}

const finalUrlParameters = computed<UrlParameters>(() => ({
    ...defaultUrlParameters,
    ...(props.urlParameters ?? {})
}))

const finalConfiguration = computed<{ [key: string]: any }>(() => ({
    ...defaultConfiguration,
    ...(props.configuration ?? {})
}))

const parser = new DOMParser()
const xml = ref(props.xml ?? "")
const xmlNode = computed(() => parser.parseFromString(xml.value, "application/xml"))

const iframeUrl = computed(() =>
    getEmbedUrl(props.baseUrl, finalUrlParameters.value, props.configuration != null)
)
const iframeRef = ref<HTMLIFrameElement>()

const action = new DrawAction(iframeRef)

const messageHandler = (evt: MessageEvent) => {
    handleEvent(
        evt,
        {
            init: (data) => {
                var autosave = false
                if (finalConfiguration.value["autosave"]) {
                    autosave = true
                }
                action.load(xml.value, autosave, props.title,)
            },
            configure: (data) => {
                action.configure(finalConfiguration.value)
            },
            autosave: (data) => {
                if (props.onAutosave) {
                    props.onAutosave(data)
                }

                xml.value = data.xml
            },
            load: (data) => {
                if (props.onLoad) {
                    props.onLoad(data)
                }
            },
            openLink: (data) => {
                if (props.onOpenLink) {
                    props.onOpenLink(data)
                }
            },
            exit: (data) => {
                if (props.onExit) {
                    props.onExit(data)
                }
                if (window.opener) {
                    sessionStorage.removeItem('drawio-edit-value')
                    window.close()
                }
            },
            save: (data) => {
                action.drawioExport({ format: props.format ?? "xmlsvg", exit: data.exit })
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
                    var autosave = false
                    if (finalConfiguration.value["autosave"]) {
                        autosave = true
                    }
                    action.load(data.xml, autosave, props.title,)
                }
            },
            draft: (data) => {
                // TODO: need merge draft xml to current if result: 'edit'
                if (props.onDraft) {
                    props.onDraft(data)
                }
            },
            export: (data) => {
                if (props.onSaveOrExport) {
                    props.onSaveOrExport(data)
                }

                if (data?.message?.exit && props.onExit) {
                    props.onExit({
                        event: 'exit',
                        modified: true,
                    })
                }

                xml.value = data.xml
                if (window.opener) {
                    var d = {
                        data: data.data,
                        xml: data.xml,
                        type: "drawio-export-event",
                    }
                    window.opener.postMessage(d, location.origin)
                    if (data.message.exit) {
                        sessionStorage.removeItem('drawio-edit-value')
                        window.close()
                    }
                } 
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
    action.template({ callback })
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

const drawioExport = (format: ExportFromat) => {
    action.drawioExport({ format })
}

useEventListener(window, 'message', messageHandler)

onMounted(() => {
    const storedValue = sessionStorage.getItem('drawio-edit-value') || ''
    xml.value = storedValue
})

onUnmounted(() => {
    sessionStorage.removeItem('drawio-edit-value')
})

defineExpose({
    merge,
    dialog,
    prompt,
    template,
    layout,
    draft,
    status,
    spinner,
    drawioExport,
})
</script>

<template>
    <iframe className="diagrams-iframe" ref="iframeRef" :src="iframeUrl" />
</template>

<style scoped lang="scss">
iframe {
    width: 100%;
    height: 100%;
    min-width: 400px;
    min-height: 400px;
    border: none;
}
</style>
