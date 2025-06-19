<script lang="ts" setup>
import { ref, watch, watchEffect, computed, onMounted, onUnmounted } from 'vue'

import { useEventListener } from '@/composables/event'
import { useIDBClient } from '@/composables/useIDBClient'
import { DrawAction } from './action'
import type { ExportFromat, LayoutType } from './action'
import { handleEvent } from './event'
import type { MergeEvent, PromptEvent, PromptCancelEvent, DraftEvent, LoadEvent, AutosaveEvent, OpenLinkEvent, ExitEvent, ExportEvent } from './event'
import type { UrlParameters } from './types'
import { getEmbedUrl } from './types'
import { useAuth } from '@/plugins/auth'

export interface IEmbedDrawioProps {
    xml?: string
    baseUrl?: string
    urlParameters?: UrlParameters
    configuration?: { [key: string]: any }
    title?: string
    format?: ExportFromat
    storageSuffix?: string
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

const authService = useAuth()
const storageKeyPrefix = "drawio-xmlsvg-value-"
const props = withDefaults(defineProps<IEmbedDrawioProps>(), {
    storageSuffix: "new",
})
const storagekey = storageKeyPrefix + props.storageSuffix

const defaultUrlParameters: UrlParameters = {
    ui: 'kennedy',
    spin: true,
    libraries: true,
    saveAndExit: true,
    modified: false,
}

const defaultConfiguration: { [key: string]: any } = {
    defaultFonts: ['Humor Sans'],
    autosave: true,
    language: "zh",
    customLibraries: ["L.scratchpad"],
    formatWidth: "240",
    createTarget: false,
    pageFormat: {
        x: 0,
        y: 0,
        width: 827,
        height: 1169
    },
    search: true,
    showStartScreen: true,
    gridColor: "#d0d0d0",
    darkGridColor: "#424242",
    darkMode: "auto",
    openCounter: 2,
    unit: 1,
    isRulerOn: false,
    // enableChatGpt: true,
    gptApiKey: "dummy-key",
    gptModel: "openai/gpt-4.1",
    gptUrl: "https://models.github.ai/inference/chat/completions"
};

const finalUrlParameters = computed<UrlParameters>(() => {
    let p = ({
        ...defaultUrlParameters,
        ...(props.urlParameters ?? {})
    })
    if (!authService.isAuthenticated()) {
        p.saveAndExit = false
        p.noSaveBtn = true
        p.noExitBtn = false
    }
    return p
})

const finalConfiguration = computed<{ [key: string]: any }>(() => ({
    ...defaultConfiguration,
    ...(props.configuration ?? {})
}))

const parser = new DOMParser()
const xml = ref(props.xml ?? "")
const xmlNode = computed(() => parser.parseFromString(xml.value, "application/xml"))
const db = useIDBClient('drawio-db', 'images')

const iframeUrl = computed(() =>
    getEmbedUrl(props.baseUrl, finalUrlParameters.value, finalConfiguration != null)
)
const iframeRef = ref<HTMLIFrameElement>()

const action = new DrawAction(iframeRef)

const messageHandler = (evt: MessageEvent) => {
    handleEvent(
        evt,
        {
            init: (data) => {
                var autosave = finalConfiguration.value.autosave == true
                action.load(xml.value, autosave, props.title,)
            },
            load: (data) => {
                if (props.onLoad) {
                    props.onLoad(data)
                }
            },
            // this event sender is other page not Drawio.
            // it used to load xml data manualy.
            // It looks consistent with the `init` logic, but it should call the merge action.
            'drawio-data': (data) => {
                if (data.xml != "" && xml.value != data.xml) {
                    var autosave = finalConfiguration.value.autosave == true
                    // TODO: it will trigger load event again, i want use merger, but it seems not work!
                    action.load(data.xml, autosave, props.title,)
                }
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

onMounted(async () => {
    // this is used for other to component send xml data when open with windows.open
    let storedValue = sessionStorage.getItem('drawio-edit-value') || ''
    if (storedValue == "") {
        storedValue = (await db.getData<string>(storagekey)) ?? ""
    }
    xml.value = storedValue
})

onUnmounted(() => {
    sessionStorage.removeItem('drawio-edit-value')
})

watch(xml, async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
        await db.setData(storagekey, newVal)
    }
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
