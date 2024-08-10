/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly REACT_APP_AWS_SERVER: string
    readonly REACT_APP_TRANSLATE_SERVER: string
    readonly REACT_APP_TRANSLATE_VSERION: string
    readonly REACT_APP_TRANSLATE_KEY: string
    readonly REACT_APP_TRANSLATE_REGION: string
    readonly REACT_APP_PDFJS_CDN: string
    readonly REACT_APP_GITTALK_REPO: string
    readonly REACT_APP_GITTALK_OWNER: string
    readonly REACT_APP_GITTALK_NUMBER: number
    readonly REACT_APP_GITTALK_CLIENTID: string
    readonly REACT_APP_GITTALK_CLIENTSECRET: string
    readonly REACT_APP_GITTALK_PRE_PAGE: number
    readonly REACT_APP_INFR_PROJECT_SERVER: string
    readonly REACT_APP_HONEYCOMB_SDK_API_KEY: string
    readonly REACT_APP_HONEYCOMB_SDK_BACKEND_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
