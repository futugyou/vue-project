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
    title: string
    message: string
    button: string
    modified: boolean
} | {
    titleKey: string
    messageKey: string
    button: string
    buttonKey: boolean
}

export type PromptAction = {
    title: string
    ok: string
    defaultValue: string
} | {
    titleKey: string
    okKey: string
    defaultValue: string
}

export type LayoutAction = {
    layouts: [
        {
            layout: LayoutType,
            config?: { [key: string]: any }
        }
    ]
}

export type LayoutType = 'mxHierarchicalLayout' | 'mxCircleLayout' | 'mxCompactTreeLayout' | 'mxEdgeLabelLayout' | 'mxFastOrganicLayout' | 'mxParallelEdgeLayout' | 'mxPartitionLayout' | 'mxRadialTreeLayout' | 'mxStackLayout'

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

    dialog(data: DialogAction) {
        action(this.iframeRef, "dialog", data)
    }

    prompt(data: PromptAction) {
        action(this.iframeRef, "prompt", data)
    }

    template(callback: boolean) {
        if (callback) {
            action(this.iframeRef, "template", { callback: true })
        }
        else {
            action(this.iframeRef, "template", {})
        }
    }

    layout(layout: LayoutAction) {
        action(this.iframeRef, "layout", layout)
    }
}

