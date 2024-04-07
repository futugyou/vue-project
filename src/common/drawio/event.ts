import { DraftAction, MergeAction, PromptAction } from "./action"

type EventHandler = {
    [key in DrawioEvent['event']]?: (data: Extract<DrawioEvent, { event: key }>) => void
}

export const handleEvent = (event: MessageEvent, handlers: EventHandler, baseUrl?: string) => {
    if (!event.origin.includes('embed.diagrams.net') && (baseUrl && !event.origin.includes(baseUrl))) {
        return
    }

    if ((event?.data?.source as string ?? "").startsWith("react-devtools")) {
        return
    }

    console.log(event.data)
    try {
        const data = JSON.parse(event.data) as DrawioEvent
        if (data.event in handlers) {
            const handler = handlers[data.event]
            if (handler) {
                handler(data as never)
            }
        }
    } catch (error) {

    }

}

export type DrawioEvent =
    | InitEvent
    | ConfigureEvent
    | AutosaveEvent
    | LoadEvent
    | OpenLinkEvent
    | ExitEvent
    | SaveEvent
    | MergeEvent
    | PromptEvent
    | TemplateEvent
    | DraftEvent
    | ExportEvent
    | PromptCancelEvent

export type InitEvent = {
    event: 'init'
}

export type ConfigureEvent = {
    event: 'configure'
}

export type AutosaveEvent = {
    event: 'autosave'
    xml: string
    scale: number
}

export type LoadEvent = {
    event: 'load'
    xml: string
    scale: number
}

export type OpenLinkEvent = {
    event: 'openLink'
    href: string
    target: string
}

export type ExitEvent = {
    event: 'exit'
    modified: boolean
}

export type SaveEvent = {
    event: 'save'
    exit: boolean
    xml: string
}

export type MergeEvent = {
    event: 'merge'
    message: MergeAction
    error?: any
}

export type PromptEvent = {
    event: 'prompt'
    value: string
    message: PromptAction
}

export type PromptCancelEvent = {
    event: 'prompt-cancel'
    message: PromptAction
}

export type TemplateEvent = {
    event: 'template'
    xml: string
    blank: boolean
    builtIn: boolean
    libs: string
    name: string
    message: { event: "template", callback: true }
    tempUrl: string
}

export type DraftEvent = {
    event: 'draft'
    error?: string
    result: "discard" | "edit" | "ignore"
    message: DraftAction
}

export type ExportEvent = {
    event: 'export'
    format: "html" | "html2" | "svg" | "xmlsvg" | "png" | "xmlpng"
    message: string
    data: string
    xml: string
}
