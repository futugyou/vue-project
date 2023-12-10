import { fetchEx } from '@/tools/fetch'

export interface TranslateModel {
    Text: string
}

export const translateText = async (from: string, to: string, model: TranslateModel[]) => {
    const translateEndpoint = import.meta.env.REACT_APP_TRANSLATE_SERVER + '&from=' + from + '&to=' + to
    let h: Record<string, string> = {
        'Ocp-Apim-Subscription-Key': import.meta.env.REACT_APP_TRANSLATE_KEY,
        'Ocp-Apim-Subscription-Region': import.meta.env.REACT_APP_TRANSLATE_REGION,
    }

    return fetchEx(translateEndpoint, 'post', model, false, h)
}
