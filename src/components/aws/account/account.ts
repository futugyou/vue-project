export interface Account {
    id: string
    alias: string
    accessKeyId: string
    secretAccessKey: string
    region: string
    createdAt: number
}

export const defaultAccount: Account = {
    id: '',
    alias: '',
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
    createdAt: 0
}
