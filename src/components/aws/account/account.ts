
import { useFetch } from '@/composables/fetch'

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

export const editAccount = async (account: Account) => {
    const accountEditEndpoint = import.meta.env.REACT_APP_AWS_SERVER + 'v1/accounts/' + account.id
    const { data, error } = useFetch(accountEditEndpoint, 'put', account)
    return { data, error }
}

export const createAccount = async (account: Account) => {
    const accountCreateEndpoint = import.meta.env.REACT_APP_AWS_SERVER + 'v1/accounts'
    const { data, error } = useFetch(accountCreateEndpoint, 'post', account)
    return { data, error }
}

export const getAccounts = async (page: number, limit: number) => {
    const accountGetEndpoint = import.meta.env.REACT_APP_AWS_SERVER + 'v1/accounts?page=' + page + '&limit=' + limit
    const { data, error } = useFetch(accountGetEndpoint)
    return { data, error }
}

export const deleteAccount = async (id: string) => {
    const accountDeleteEndpoint = import.meta.env.REACT_APP_AWS_SERVER + 'v1/accounts/' + id
    const { data, error } = useFetch(accountDeleteEndpoint, 'delete')
    return { data, error }
}
