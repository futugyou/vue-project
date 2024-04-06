import { Ref } from "vue"

export const drawAction = (iframeRef: Ref<HTMLIFrameElement | undefined>, action: string, data: any) => {
    iframeRef.value?.contentWindow?.postMessage(
        JSON.stringify({
            action: action,
            ...data,
        }),
        '*'
    )
}

export type MergeAction = {
    action: 'merge'
    xml: string
}
