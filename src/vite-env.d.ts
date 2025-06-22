/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VUE_APP_AWS_SERVER: string
    readonly VUE_APP_TRANSLATE_SERVER: string
    readonly VUE_APP_TRANSLATE_VSERION: string
    readonly VUE_APP_TRANSLATE_KEY: string
    readonly VUE_APP_TRANSLATE_REGION: string
    readonly VUE_APP_PDFJS_CDN: string
    readonly VUE_APP_GITTALK_REPO: string
    readonly VUE_APP_GITTALK_OWNER: string
    readonly VUE_APP_GITTALK_NUMBER: number
    readonly VUE_APP_GITTALK_CLIENTID: string
    readonly VUE_APP_GITTALK_CLIENTSECRET: string
    readonly VUE_APP_GITTALK_PRE_PAGE: number
    readonly VUE_APP_INFR_PROJECT_SERVER: string
    readonly VUE_APP_HONEYCOMB_SDK_API_KEY: string
    readonly VUE_APP_HONEYCOMB_SDK_BACKEND_URL: string
    readonly VUE_APP_CLIENT_ID: string
    readonly VUE_APP_PROVIDER: string
    readonly VUE_APP_REDIRECT_URI: string
    readonly VUE_APP_AUTHORIZE: string
    readonly VUE_APP_TOKEN: string
    readonly VUE_APP_GoogleClientId: string
    readonly VUE_APP_GoogleAppId: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
