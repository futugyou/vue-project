import { fetchEx } from '@/tools/fetch'

export interface Parameter {
    id: string
    accountId: string
    alias: string
    region: string
    key: string
    version: string
    operateAt: number
}

export const defaultParameter: Parameter = {
    id: '',
    accountId: '',
    alias: '',
    region: '',
    key: '',
    version: '',
    operateAt: 0
}

export interface SyncParameter {
    id: string
}

export const getParameters = async (page: number, limit: number, region: string, key: string, alias: string) => {
    let parameterGetEndpoint =
        import.meta.env.REACT_APP_AWS_SERVER + 'v1/parameters?page=' + page + '&limit=' + limit
    if (region) {
        parameterGetEndpoint += '&region=' + region
    }

    if (key) {
        parameterGetEndpoint += '&key=' + key
    }

    if (alias) {
        parameterGetEndpoint += '&alias=' + alias
    }

    return fetchEx(parameterGetEndpoint, ...[, ,], true)
}

export const syncParameter = async (sync: SyncParameter) => {
    const parameterSyncEndpoint =
        import.meta.env.REACT_APP_AWS_SERVER + 'v1/parameters/sync'
    return fetchEx(parameterSyncEndpoint, 'post', sync, true)
}

export const getParameter = async (id: string) => {
    const parameterGetEndpoint =
        import.meta.env.REACT_APP_AWS_SERVER + 'v1/parameters/' + id
    return fetchEx(parameterGetEndpoint, ...[, ,], true)
}

export const getParameterCompare = async (sourceid: string, destid: string) => {
    const parameterGetEndpoint =
        import.meta.env.REACT_APP_AWS_SERVER + 'v1/parameters/compare?sourceid=' + sourceid + '&destid=' + destid
    return fetchEx(parameterGetEndpoint, ...[, ,], true)
} 
