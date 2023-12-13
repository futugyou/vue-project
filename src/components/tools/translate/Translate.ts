import { fetchEx } from '@/tools/fetch'

export interface TranslateModel {
    Text: string
}

export interface DetectLanguageModel {
    language: string
    score: number
    isTranslationSupported: boolean
    isTransliterationSupported: boolean
}

const api_version = "api-version=" + import.meta.env.REACT_APP_TRANSLATE_VSERION
const api_endpoint = import.meta.env.REACT_APP_TRANSLATE_SERVER
const translate_api = api_endpoint + 'translate?' + api_version
const detect_api = api_endpoint + 'detect?' + api_version

export const translateText = async (from: string, to: string, model: TranslateModel[]) => {
    const translateEndpoint = translate_api + '&from=' + from + '&to=' + to
    let h: Record<string, string> = {
        'Ocp-Apim-Subscription-Key': import.meta.env.REACT_APP_TRANSLATE_KEY,
        'Ocp-Apim-Subscription-Region': import.meta.env.REACT_APP_TRANSLATE_REGION,
    }

    return fetchEx(translateEndpoint, 'post', model, false, h)
}

export const detectLanguage = async (from: string, to: string, model: TranslateModel[]) => {
    const detectEndpoint = detect_api
    let h: Record<string, string> = {
        'Ocp-Apim-Subscription-Key': import.meta.env.REACT_APP_TRANSLATE_KEY,
        'Ocp-Apim-Subscription-Region': import.meta.env.REACT_APP_TRANSLATE_REGION,
    }

    return fetchEx(detectEndpoint, 'post', model, false, h)
}
