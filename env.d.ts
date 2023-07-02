/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly REACT_APP_AWS_SERVER: string 
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
