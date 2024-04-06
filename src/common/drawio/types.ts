import { MergeAction } from "./action"

// https://www.drawio.com/doc/faq/embed-mode
export type UrlParameters = {
    ui?: 'min' | 'atlas' | 'kennedy' | 'dark' | 'sketch' | 'simple'
    spin?: boolean
    modified?: boolean
    keepmodified?: boolean
    libraries?: boolean
    noSaveBtn?: boolean
    saveAndExit?: boolean
    noExitBtn?: boolean
}

export type SkipEvent = {
    source: string
    hello: boolean
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

export type InitEvent = {
    event: 'init'
}

export type ConfigureEvent = {
    event: 'configure'
}

export type AutosaveEvent = {
    event: 'autosave'
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
    message: string
}

export type TemplateEvent = {
    event: 'template'
    xml: string
    blank: boolean
    name: string
    message: string
}

export type DraftEvent = {
    event: 'draft'
    error?: string
    result?: string
    message: string
}

export type ExportEvent = {
    event: 'export'
    format: "html" | "html2" | "svg" | "xmlsvg" | "png" | "xmlpng"
    message: string
    data: string
    xml: string
}
