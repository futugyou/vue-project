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
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
