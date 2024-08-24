import { fetchEx } from '@/tools/fetch'

const BASE_PATH = import.meta.env.REACT_APP_AWS_SERVER.replace(/\/+$/, "")

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

export const checkAccount = (account: Account) => {
    let message: string[] = []
    if (account == null) {
        message.push('fields missing')
    } else {
        if (!account.accessKeyId || account.accessKeyId.length < 5 || account.accessKeyId.length > 25) {
            message.push('AccessKeyId is required, and lenght Must between 5 and 25')
        }
        if (!account.alias || account.alias.length < 5 || account.alias.length > 25) {
            message.push('Alias is required, and lenght Must between 5 and 25')
        }
        if (!account.region || account.region.length < 5 || account.region.length > 25) {
            message.push('Region is required, and lenght Must between 5 and 25')
        }
        if (!account.secretAccessKey || account.secretAccessKey.length < 5 || account.secretAccessKey.length > 50) {
            message.push('SecretAccessKey is required, and lenght Must between 5 and 50')
        }
    }

    return { successed: message.length == 0, message }
}

export const editAccount = async (account: Account) => {
    const accountEditEndpoint = BASE_PATH + '/api/v1/accounts/' + account.id
    return fetchEx(accountEditEndpoint, 'put', account, true)
}

export const createAccount = async (account: Account) => {
    const accountCreateEndpoint = BASE_PATH + '/api/v1/accounts'
    return fetchEx(accountCreateEndpoint, 'post', account, true)
}

export const getAccountsWithPaging = async (page: number, limit: number) => {
    const accountGetEndpoint = BASE_PATH + '/api/v1/accounts?page=' + page + '&limit=' + limit
    return fetchEx(accountGetEndpoint, ...[, ,], true)
}

export const getAccounts = async () => {
    const accountGetEndpoint = BASE_PATH + '/api/v1/accounts'
    return fetchEx(accountGetEndpoint, ...[, ,], true)
}

export const getAccount = async (id: string) => {
    const accountGetEndpoint = BASE_PATH + '/api/v1/accounts/' + id
    return fetchEx(accountGetEndpoint, ...[, ,], true)
}

export const deleteAccount = async (id: string) => {
    const accountDeleteEndpoint = BASE_PATH + '/api/v1/accounts/' + id
    return fetchEx(accountDeleteEndpoint, 'delete', ...[,], true)
}
