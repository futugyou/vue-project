import _ from 'lodash-es'

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
    const filtered = _.pickBy<T>(currentData, (value, key) => !_.isEqual(value, originalData[key as keyof T]))
    return Object.keys(filtered).reduce((result, key) => {
        if (key in originalData) {
            (result as any)[key] = filtered[key as keyof T]
        }
        return result
    }, {} as P)
}

export const flattenObject = (obj: Record<string, any>, parentKey = '', result: Record<string, string> = {}): Record<string, string> => {
    for (const [key, value] of Object.entries(obj)) {
        const newKey = parentKey ? `${parentKey}__${key}` : key
        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                const arrayKey = `${newKey}__${index}`
                flattenObject(item, arrayKey, result)
            })
        } else if (value && typeof value === 'object') {
            flattenObject(value, newKey, result)
        } else {
            result[newKey] = String(value)
        }
    }
    return result
}