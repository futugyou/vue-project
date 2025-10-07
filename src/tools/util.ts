import { pickBy, isEqual } from 'lodash-es'

export const imageBitmapToCanvas = async (imageBitmap: ImageBitmap): Promise<HTMLCanvasElement> => {
    // Create an offscreen canvas
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height)
    const offscreenContext = canvas.getContext('2d')

    // Draw the ImageBitmap onto the offscreen canvas
    offscreenContext?.drawImage(imageBitmap, 0, 0)

    // Create a visible canvas
    const visibleCanvas = document.createElement('canvas')
    visibleCanvas.width = imageBitmap.width
    visibleCanvas.height = imageBitmap.height

    // Get the rendering context for the visible canvas
    const visibleContext = visibleCanvas.getContext('2d')!

    visibleContext.drawImage(canvas, 0, 0)

    return visibleCanvas
}

export const ArrayChunks = <T>(items: T[], n: number) => {
    let chunks = []

    for (let i = 0; i < items.length; i += n) {
        chunks.push(items.slice(i, i + n))
    }
    return chunks
}

export const queryStringify = (query: { [x: string]: any }) => {
    const queryString = Object.keys(query)
        .map(key => `${key}=${encodeURIComponent(query[key] || '')}`)
        .join('&')
    return queryString
}

export const b64toB64UrlEncoded = (str: string): string => {
    return str
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "")
}

export const shaString = async (str: string): Promise<string> => {
    // Encode string to Uint8Array using TextEncoder
    const encoder = new TextEncoder()
    const data = encoder.encode(str)

    // Generate SHA-256 hash using Web Crypto API
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)

    // Convert ArrayBuffer to Uint8Array
    const hashArray = new Uint8Array(hashBuffer)

    // Convert hash value to Base64 string
    const base64String = window.btoa(String.fromCharCode(...hashArray))

    return base64String
}

export const btoa = (str: string): string => {
    return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16))
    }))
}

export const atob = (base64: string): string => {
    return decodeURIComponent(Array.prototype.map.call(window.atob(base64), (c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
}


export const toSnakeCase = (str: string): string => {
    return str
        .split(/(?=[A-Z])/)
        .join('_')
        .toLowerCase()
}

export const toUrlEncoded = (obj: any): string => {
    return Object.keys(obj)
        .map(
            (k) =>
                encodeURIComponent(toSnakeCase(k)) + '=' + encodeURIComponent(obj[k])
        )
        .join('&')
}

export const getModifiedData = <T extends object, P extends Partial<T>>(currentData: T, originalData: T): P => {
    const filtered = pickBy<T>(currentData, (value, key) => !isEqual(value, originalData[key as keyof T]))
    return Object.keys(filtered).reduce((result, key) => {
        if (key in originalData) {
            (result as any)[key] = filtered[key as keyof T]
        }
        return result
    }, {} as P)
}

export const flattenObject = (obj: Record<string, any>, parentKey = '', result: Record<string, string> = {}): Record<string, string> => {
    const processEntry = (key: string, value: any) => {
        const newKey = parentKey ? `${parentKey}__${key}` : key
        if (value && typeof value === 'object') {
            if (Array.isArray(value)) {
                value.forEach((item, index) => processEntry(`${key}__${index}`, item))
            } else {
                flattenObject(value, newKey, result)
            }
        } else {
            result[newKey] = String(value)
        }
    }

    Object.entries(obj).forEach(([key, value]) => processEntry(key, value))
    return result
}

export const Uint8ArrayToURL = (uint8Array: Uint8Array): string => {
    const arr = Uint8Array.from(uint8Array);
    const blob = new Blob([arr], { type: 'image/png' });
    return URL.createObjectURL(blob);
}

export const isPublic = String(import.meta.env.VUE_APP_PUBLIC_AVAILABILITY).toLowerCase() === "true";

export const INFR_PROJECT_BASE_PATH = isPublic ? import.meta.env.VUE_APP_PUBLIC_INFR_PROJECT_SERVER.replace(/\/+$/, "") : import.meta.env.VUE_APP_INFR_PROJECT_SERVER.replace(/\/+$/, "")
export const AWS_BASE_PATH = isPublic ? import.meta.env.VUE_APP_PUBLIC_AWS_SERVER.replace(/\/+$/, "") : import.meta.env.VUE_APP_AWS_SERVER.replace(/\/+$/, "")

export const AUTH_CLIENT_ID = isPublic ? import.meta.env.VUE_APP_PUBLIC_CLIENT_ID : import.meta.env.VUE_APP_CLIENT_ID
export const AUTH_PROVIDER = isPublic ? import.meta.env.VUE_APP_PUBLIC_PROVIDER : import.meta.env.VUE_APP_PROVIDER
export const AUTH_ENDPOINT = isPublic ? import.meta.env.VUE_APP_PUBLIC_AUTHORIZE : import.meta.env.VUE_APP_AUTHORIZE
export const AUTH_TOKEN_ENDPOINT = isPublic ? import.meta.env.VUE_APP_PUBLIC_TOKEN : import.meta.env.VUE_APP_TOKEN
export const AUTH_REDIRECT_URL = isPublic ? import.meta.env.VUE_APP_PUBLIC_REDIRECT_URI : import.meta.env.VUE_APP_REDIRECT_URI

export const patchWindowOpen = (url: string) => {
    let win = (window.rawWindow ?? window) as Window & typeof globalThis

    if (url.startsWith('http://') || url.startsWith('https://')) {
        win.open(url, '_blank')
    }

    if (win.__MICRO_APP_ENVIRONMENT__) {
        let origin = location.origin.replace(/\/+$/, '')
        let path = location.pathname.replace(/^\/+/, '')

        let finalUrl = origin + '/' + path + '?' + path + '=' + url

        console.log('window open url is:', finalUrl);

        win.open(finalUrl, '_blank')
    } else {
        win.open(url, '_blank')
    }
}