import { fetchEx } from '@/tools/fetch'

const BASE_PATH = import.meta.env.VUE_APP_AWS_SERVER.replace(/\/+$/, "")

export interface EcsService {
    id: string
    account_alias: string
    cluster_name: string
    service_name: string
    operate_At: string
}

export const defaultEcsService: EcsService = {
    id: '',
    account_alias: '',
    cluster_name: '',
    service_name: '',
    operate_At: ''
}

export interface EcsTaskCompare {
    Id: string
    source_task_arn: string
    dest_task_arn: string
}

export const getEcsServices = async (page: number, limit: number, account_id: string) => {
    let ecsEndpoint = BASE_PATH + '/api/v1/ecsservices?page=' + page + '&limit=' + limit
    if (account_id) {
        ecsEndpoint += '&account_id=' + account_id
    }

    return fetchEx(ecsEndpoint, ...[, ,], true)
}

export const getEcsServiceDetail = async (id: string) => {
    const ecsEndpoint = BASE_PATH + '/api/v1/ecsservices/' + id
    return fetchEx(ecsEndpoint, ...[, ,], true)
}

export const compareEcsTaskDefinition = async (com: EcsTaskCompare) => {
    const ecsEndpoint = BASE_PATH + '/api/v1/ecsservices/compare'
    return fetchEx(ecsEndpoint, 'post', com, true)
}