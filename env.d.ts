/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly REACT_APP_AWS_SERVER: string
    readonly REACT_APP_TRANSLATE_SERVER: string
    readonly REACT_APP_TRANSLATE_KEY: string
    readonly REACT_APP_TRANSLATE_REGION: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
