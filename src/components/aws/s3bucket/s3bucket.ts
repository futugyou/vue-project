import { fetchEx } from '@/tools/fetch'

export interface S3Bucket {
    id: string
    accountId: string
    accountName: string
    name: string
    region: string
    isPublic: boolean
    policy: string
    permissions: string[]
    creationDate: string
}

export const defaultS3Bucket: S3Bucket = {
    id: '',
    accountId: '',
    accountName: '',
    name: '',
    region: '',
    isPublic: false,
    policy: '',
    permissions: [],
    creationDate: ''
}

export const getS3Buckets = async (page: number, limit: number, bucketName: string) => {
    let parameterGetEndpoint =
        import.meta.env.REACT_APP_AWS_SERVER + 'v1/s3?page=' + page + '&limit=' + limit
    if (bucketName) {
        parameterGetEndpoint += '&bucketName=' + bucketName
    }

    return fetchEx(parameterGetEndpoint, ...[, ,], true)
}

export interface S3BucketItem {
    id: string
    bucketName: string
    key: string
    size: number
    isDirectory: boolean
    creationDate: string
}

export const defaultS3BucketItem: S3BucketItem = {
    id: '',
    bucketName: '',
    key: '',
    size: 0,
    isDirectory: false,
    creationDate: ''
}

export const getS3BucketItems = async (page: number, limit: number, bucketName: string, accountId: string, perfix: string) => {
    let parameterGetEndpoint =
        import.meta.env.REACT_APP_AWS_SERVER + 'v1/s3/items?page=' + page + '&limit=' + limit
    if (bucketName) {
        parameterGetEndpoint += '&bucketName=' + bucketName
    }
    if (accountId) {
        parameterGetEndpoint += '&accountId=' + accountId
    }
    if (perfix) {
        parameterGetEndpoint += '&perfix=' + perfix
    }

    return fetchEx(parameterGetEndpoint, ...[, ,], true)
}

export const getS3Download = async (page: number, limit: number, bucketName: string, accountId: string, fileName: string) => {
    let parameterGetEndpoint =
        import.meta.env.REACT_APP_AWS_SERVER + 'v1/s3/download?page=' + page + '&limit=' + limit
    if (bucketName) {
        parameterGetEndpoint += '&bucketName=' + bucketName
    }
    if (accountId) {
        parameterGetEndpoint += '&accountId=' + accountId
    }
    if (fileName) {
        parameterGetEndpoint += '&fileName=' + fileName
    }

    //TODO: maybe need other method
    return fetchEx(parameterGetEndpoint, ...[, ,], true)
}

export const getS3ItemUrl = async (page: number, limit: number, bucketName: string, accountId: string, fileName: string) => {
    let parameterGetEndpoint =
        import.meta.env.REACT_APP_AWS_SERVER + 'v1/s3/url?page=' + page + '&limit=' + limit
    if (bucketName) {
        parameterGetEndpoint += '&bucketName=' + bucketName
    }
    if (accountId) {
        parameterGetEndpoint += '&accountId=' + accountId
    }
    if (fileName) {
        parameterGetEndpoint += '&fileName=' + fileName
    }
    return fetchEx(parameterGetEndpoint, ...[, ,], true)
}