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

export const getParameters = async (page: number, limit: number, region: string, key: string) => {
    let parameterGetEndpoint =
        import.meta.env.REACT_APP_AWS_SERVER + 'v1/parameters?page=' + page + '&limit=' + limit
    if (region) {
        parameterGetEndpoint += '&region=' + region
    }

    if (key) {
        parameterGetEndpoint += '&key=' + key
    }

    return fetchEx(parameterGetEndpoint)
}

export const getParameter = async (id: string) => {
    const parameterGetEndpoint =
        import.meta.env.REACT_APP_AWS_SERVER + 'v1/parameters/' + id
    return fetchEx(parameterGetEndpoint)
}

export const getParameterCompare = async (sourceid: string, destid: string) => {
    const parameterGetEndpoint =
        import.meta.env.REACT_APP_AWS_SERVER + 'v1/parameters/compare?sourceid=' + sourceid + '&destid=' + destid
    return fetchEx(parameterGetEndpoint)
} 