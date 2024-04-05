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
    | OpenLinkEvent
    | ExitEvent
    | SaveEvent

export type InitEvent = {
    event: 'init'
}

export type OpenLinkEvent = {
    event: 'openLink'
    href: string
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
