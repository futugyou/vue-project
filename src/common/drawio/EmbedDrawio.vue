<script lang="ts" setup>
import { ref, watch, watchEffect, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import { useEventListener } from '@/composables/event'
import { useIDBClient } from '@/composables/useIDBClientEx'
import { useLocalStorage } from '@vueuse/core'
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
let storagekey = storageKeyPrefix + props.storageSuffix
const route = useRoute()
const suffix = (route.query.suffix ?? "") as string
if (suffix) {
    storagekey = storageKeyPrefix + suffix
}

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

const storagedConfig = useLocalStorage<{ [key: string]: any }>(".configuration", {})
const finalConfiguration = ref<{ [key: string]: any }>({})
const getFinalConfiguration = (override?: Record<string, any>): Record<string, any> => {
    return {
        ...defaultConfiguration,
        ...(storagedConfig.value ?? {}),
        ...(props.configuration ?? {}),
        ...(override ?? {})
    }
}

const parser = new DOMParser()
const xml = ref(props.xml ?? "")
const xmlNode = computed(() => parser.parseFromString(xml.value, "application/xml"))
const db = useIDBClient('drawio-db', 'images')

const iframeUrl = ref(getEmbedUrl(props.baseUrl, finalUrlParameters.value))
const iframeRef = ref<HTMLIFrameElement>()

const configBtn = ref(null)
const chatConfigStr = ref<string>("{}")

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

const updateIfChanged = (newConfig: Record<string, any>) => {
    const oldStr = JSON.stringify(finalConfiguration.value)
    const newStr = JSON.stringify(newConfig)

    if (oldStr !== newStr) {
        finalConfiguration.value = newConfig
        iframeUrl.value = getEmbedUrl(props.baseUrl, finalUrlParameters.value)
    }
}

const handleSave = (isActive: { value: boolean }) => {
    try {
        const parsed = JSON.parse(chatConfigStr.value)
        storagedConfig.value = parsed
        const merged = getFinalConfiguration(parsed)
        updateIfChanged(merged)

        isActive.value = false
    } catch (e) {
    }
}

const handleReset = (isActive: { value: boolean }) => {
    storagedConfig.value = {}

    const resetConfig = {
        ...defaultConfiguration,
        ...(props.configuration ?? {})
    }

    updateIfChanged(resetConfig)
    chatConfigStr.value = JSON.stringify(resetConfig, null, 2)
    // isActive.value = false
}

useEventListener(window, 'message', messageHandler)

onMounted(async () => {
    let storedValue = ""
    if (window.opener) {
        // this is used for other to component send xml data when open with windows.open
        storedValue = sessionStorage.getItem('drawio-edit-value') || ""
    }

    if (storedValue == "") {
        storedValue = (await db.getData<string>(storagekey)) ?? ""
    }
    xml.value = storedValue

    const merged = getFinalConfiguration()
    finalConfiguration.value = merged
    chatConfigStr.value = JSON.stringify(merged, null, 2)
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
    <v-sheet class="h-100 w-100 position-relative">
        <v-sheet class="position-absolute right-0" style="background-color: transparent;">
            <v-hover>
                <template v-slot:default="{ isHovering, props }">
                    <v-btn ref="configBtn" density="compact" icon="settings" variant="text"
                        :color="isHovering ? '#75FBFD' : undefined">
                    </v-btn>
                </template>
            </v-hover>
            <v-dialog :activator="configBtn!" max-width="50%">
                <template v-slot:default="{ isActive }">
                    <v-card rounded="lg">
                        <v-card-text>
                            <v-textarea :counter="300" class="mb-2" rows="10" variant="outlined"
                                v-model="chatConfigStr"></v-textarea>
                        </v-card-text>

                        <v-divider class="mt-2"></v-divider>

                        <v-card-actions class="my-2 d-flex justify-end">
                            <v-btn class="text-none" rounded="xl" text="Reset" @click="handleReset(isActive)"></v-btn>
                            <v-btn class="text-none" rounded="xl" text="Cancel" @click="isActive.value = false"></v-btn>

                            <v-btn class="text-none" color="primary" rounded="xl" text="Save" variant="flat"
                                @click="handleSave(isActive)"></v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>
        </v-sheet>
        <iframe className="diagrams-iframe" ref="iframeRef" :src="iframeUrl" />
    </v-sheet>
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
