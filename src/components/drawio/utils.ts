import _ from 'lodash-es'
import { DrawioEvent, UrlParameters } from './types'

export const getEmbedUrl = (baseUrl?: string, urlParameters?: UrlParameters, addConfiguration?: boolean) => {
    const url = new URL('/', baseUrl ?? 'https://embed.diagrams.net')
    const urlSearchParams = new URLSearchParams()

    urlSearchParams.append('proto', 'json')
    urlSearchParams.append('returnbounds', '1')
    if (addConfiguration) {
        urlSearchParams.append('configure', '1')
    }

    if (urlParameters) {
        for (const key in urlParameters) {
            const value = _.get(urlParameters, key)
            if (value !== undefined) {
                if (typeof value === 'boolean') {
                    urlSearchParams.append(key, value ? '1' : '0')
                } else {
                    urlSearchParams.append(key, value.toString())
                }
            }
        }
    }

    url.search = urlSearchParams.toString()

    return url.toString()
}

type EventHandler = {
    [key in DrawioEvent['event']]?: (data: Extract<DrawioEvent, { event: key }>) => void
}

export function handleEvent(event: MessageEvent, handlers: EventHandler, baseUrl?: string) {
    if (!event.origin.includes('embed.diagrams.net') && (baseUrl && !event.origin.includes(baseUrl))) {
        return
    }

    const ss = event?.data?.source
    if (ss) {
        return
    }

    console.log(event.data)
    const data = JSON.parse(event.data) as DrawioEvent
    if (data.event in handlers) {
        const handler = handlers[data.event]
        if (handler) {
            handler(data as never)
        }
    }
}