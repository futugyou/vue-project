import { get } from 'lodash-es'

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

export const getEmbedUrl = (baseUrl?: string, urlParameters?: UrlParameters) => {
    const url = new URL('/', baseUrl ?? 'https://embed.diagrams.net')
    const urlSearchParams = new URLSearchParams()

    urlSearchParams.append('proto', 'json')
    urlSearchParams.append('returnbounds', '1')
    urlSearchParams.append('configure', '1')

    if (urlParameters) {
        for (const key in urlParameters) {
            const value = get(urlParameters, key)
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
