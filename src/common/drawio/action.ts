import { Ref } from "vue"

const action = (iframeRef: Ref<HTMLIFrameElement | undefined>, action: string, data: any) => {
    iframeRef.value?.contentWindow?.postMessage(
        JSON.stringify({
            action: action,
            ...data,
        }),
        '*'
    )
}

type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

type OmitActionField<T> = DistributiveOmit<T, 'action'>

export type LoadAction = {
    action: 'load'
    xml: string
    autosave: boolean
    title: string
}

export type MergeAction = {
    action: 'merge'
    xml: string
}

type DialogAction = {
    action: 'dialog'
    title: string
    message: string
    button: string
    modified: boolean
} | {
    action: 'dialog'
    titleKey: string
    messageKey: string
    button: string
    buttonKey: boolean
}

export type PromptAction = {
    action: 'prompt'
    title: string
    ok: string
    defaultValue: string
} | {
    action: 'prompt'
    titleKey: string
    okKey: string
    defaultValue: string
}

export type LayoutAction = {
    action: 'layout'
    layouts: [
        {
            layout: LayoutType,
            config?: { [key: string]: any }
        }
    ]
}

export type LayoutType = 'mxHierarchicalLayout' | 'mxCircleLayout' | 'mxCompactTreeLayout' | 'mxEdgeLabelLayout' | 'mxFastOrganicLayout' | 'mxParallelEdgeLayout' | 'mxPartitionLayout' | 'mxRadialTreeLayout' | 'mxStackLayout'

export type DraftAction = {
    action: 'draft'
    xml: string
    name: string
    editKey?: string
    discardKey?: string
    ignore?: boolean
}

export type StatusAction = {
    action: 'status'
    message: string
    modified: boolean
} | {
    action: 'status'
    messageKey: string
    modified: boolean
}

export type SpinnerAction = {
    action: 'spinner'
    message?: string
    show: boolean
} | {
    action: 'spinner'
    messageKey?: string
    show: boolean
}

export type ExportFromat = "html" | "html2" | "svg" | "xmlsvg" | "png" | "xmlpng"

export type TemplateAction = {
    action: 'template'
    callback: boolean
}

export type ExportAction = {
    action: 'export'
    format: ExportFromat
    exit?: boolean
}

export class DrawAction {
    iframeRef: Ref<HTMLIFrameElement | undefined>

    constructor(iframeRef: Ref<HTMLIFrameElement | undefined>) {
        this.iframeRef = iframeRef
    }

    load(xml?: string, autosave?: boolean, title?: string) {
        action(this.iframeRef, "load", { xml: xml, autosave: autosave == false ? 0 : 1, title: title ?? "" })
    }

    configure(configuration?: { [key: string]: any }) {
        action(this.iframeRef, "configure", { config: configuration })
    }

    merge(xml: string) {
        action(this.iframeRef, "merge", { xml: xml })
    }

    dialog(data: OmitActionField<DialogAction>) {
        action(this.iframeRef, "dialog", data)
    }

    prompt(data: OmitActionField<PromptAction>) {
        action(this.iframeRef, "prompt", data)
    }

    template(data: OmitActionField<TemplateAction>) {
        action(this.iframeRef, "template", data)
    }

    layout(layout: OmitActionField<LayoutAction>) {
        action(this.iframeRef, "layout", layout)
    }

    draft(data: OmitActionField<DraftAction>) {
        action(this.iframeRef, "draft", data)
    }

    status(data: OmitActionField<StatusAction>) {
        action(this.iframeRef, "status", data)
    }

    spinner(data: OmitActionField<SpinnerAction>) {
        action(this.iframeRef, "spinner", data)
    }

    drawioExport(data: OmitActionField<ExportAction>) {
        action(this.iframeRef, "export", data)
    }
}
