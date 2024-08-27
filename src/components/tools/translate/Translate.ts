import { fetchEx } from '@/tools/fetch'
import { ArrayChunks } from '@/tools/util'

export interface TranslateModel {
    Text: string
    Translation: string
}

export interface DetectLanguageModel {
    language: string
    score: number
    isTranslationSupported: boolean
    isTransliterationSupported: boolean
}

export interface DictionaryLookupModel {
    normalizedSource: string
    displaySource: string
    translations: Translation[]
}

export interface ExampleModel {
    sourcePrefix: string
    sourceTerm: string
    sourceSuffix: string
    targetPrefix: string
    targetTerm: string
    targetSuffix: string
}

export interface Translation {
    normalizedTarget: string
    displayTarget: string
    posTag: string
    confidence: number
    prefixWord: string
    backTranslations: BackTranslation[]
}

export interface BackTranslation {
    normalizedText: string
    displayText: string
    numExamples: number
    frequencyCount: number
    examples: ExampleModel[]
}

export interface LanguageListModel {
    translation: Record<string, LanguageDetail>
    dictionary: Record<string, LanguageDetail>
}

export interface LanguageDetail {
    name: string
    nativeName: string
    dir: string
    code: string
    scripts: LanguageDetail[]
    toScripts: LanguageDetail[]
}

export interface DictionaryExampleModel {
    normalizedSource: string
    normalizedTarget: string
    examples: ExampleModel[]
}

const api_version = "api-version=" + import.meta.env.VUE_APP_TRANSLATE_VSERION
const api_endpoint = import.meta.env.VUE_APP_TRANSLATE_SERVER
const subscription_key = import.meta.env.VUE_APP_TRANSLATE_KEY
const subscription_region = import.meta.env.VUE_APP_TRANSLATE_REGION

const languages_api = api_endpoint + 'languages?' + api_version
const translate_api = api_endpoint + 'translate?' + api_version
const detect_api = api_endpoint + 'detect?' + api_version
const lookup_api = api_endpoint + 'dictionary/lookup?' + api_version
const examples_api = api_endpoint + 'dictionary/examples?' + api_version

export const translateText = async (from: string, to: string, model: TranslateModel[]) => {
    const translateEndpoint = translate_api + '&from=' + from + '&to=' + to
    let h: Record<string, string> = {
        'Ocp-Apim-Subscription-Key': subscription_key,
        'Ocp-Apim-Subscription-Region': subscription_region,
    }

    return fetchEx(translateEndpoint, 'post', model, false, h)
}

export const detectLanguage = async (from: string, to: string, model: TranslateModel[]) => {
    const detectEndpoint = detect_api
    let h: Record<string, string> = {
        'Ocp-Apim-Subscription-Key': subscription_key,
        'Ocp-Apim-Subscription-Region': subscription_region,
    }

    return fetchEx(detectEndpoint, 'post', model, false, h)
}

export const lookupDictionary = async (from: string, to: string, model: TranslateModel[]) => {
    const lookupEndpoint = lookup_api + '&from=' + from + '&to=' + to
    let h: Record<string, string> = {
        'Ocp-Apim-Subscription-Key': subscription_key,
        'Ocp-Apim-Subscription-Region': subscription_region,
    }

    return fetchEx(lookupEndpoint, 'post', model, false, h)
}

export const lookupDictionaryExamples = async (from: string, to: string, model: TranslateModel[]) => {
    const examplesEndpoint = examples_api + '&from=' + from + '&to=' + to
    let h: Record<string, string> = {
        'Ocp-Apim-Subscription-Key': subscription_key,
        'Ocp-Apim-Subscription-Region': subscription_region,
    }

    const submodels = ArrayChunks(model, 10)
    let result = []
    for (let i = 0; i < submodels.length; i++) {
        const { data, error } = await fetchEx(examplesEndpoint, 'post', submodels[i], false, h)
        if (error) {
            return { data, error }
        }
        result.push(...data)
    }

    return { data: result, error: undefined }
}

export const languageList = async () => {
    const languagesEndpoint = languages_api
    return fetchEx(languagesEndpoint, 'get')
}
