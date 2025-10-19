import { fetchEx } from '@/tools/fetch'

import { AWS_BASE_PATH as BASE_PATH } from "@/tools/util"

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
    let parameterGetEndpoint = BASE_PATH + '/api/v1/s3?page=' + page + '&limit=' + limit
    if (bucketName) {
        parameterGetEndpoint += '&bucketName=' + bucketName
    }

    return fetchEx(parameterGetEndpoint, ...[, ,], false)
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
    let parameterGetEndpoint = BASE_PATH + '/api/v1/s3/items?page=' + page + '&limit=' + limit
    if (bucketName) {
        parameterGetEndpoint += '&bucketName=' + bucketName
    }
    if (accountId) {
        parameterGetEndpoint += '&accountId=' + accountId
    }
    if (perfix) {
        parameterGetEndpoint += '&perfix=' + perfix
    }

    return fetchEx(parameterGetEndpoint, ...[, ,], false)
}

export const getS3Download = async (bucketName: string, accountId: string, fileName: string) => {
    let parameterGetEndpoint = BASE_PATH + '/api/v1/s3/download'

    parameterGetEndpoint += '?bucketName=' + bucketName

    if (accountId) {
        parameterGetEndpoint += '&accountId=' + accountId
    }
    if (fileName) {
        parameterGetEndpoint += '&fileName=' + fileName
    }

    //TODO: maybe need other method
    return fetchEx(parameterGetEndpoint, ...[, ,], true)
}

export const getS3ItemUrl = async (bucketName: string, accountId: string, fileName: string) => {
    let parameterGetEndpoint = BASE_PATH + '/api/v1/s3/url'

    parameterGetEndpoint += '?bucketName=' + bucketName

    if (accountId) {
        parameterGetEndpoint += '&accountId=' + accountId
    }
    if (fileName) {
        parameterGetEndpoint += '&fileName=' + fileName
    }
    return fetchEx(parameterGetEndpoint, ...[, ,], true)
}