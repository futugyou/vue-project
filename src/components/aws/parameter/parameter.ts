import { fetchEx } from '@/tools/fetch'

export interface Parameter {
    Id: string
    AccountId: string
    Region: string
    Key: string
    Version: string
    OperateAt: number
}

export const defaultParameter: Parameter = {
    Id: '',
    AccountId: '',
    Region: '',
    Key: '',
    Version: '',
    OperateAt: 0
}

export const getParameters = async (page: number, limit: number) => {
    const parameterGetEndpoint =
        import.meta.env.REACT_APP_AWS_SERVER + 'v1/parameters?page=' + page + '&limit=' + limit
    return fetchEx(parameterGetEndpoint)
}

export const getParameter = async (id: string) => {
    const parameterGetEndpoint =
        import.meta.env.REACT_APP_AWS_SERVER + 'v1/parameters/' + id
    return fetchEx(parameterGetEndpoint)
} 
