import { BaseAPI, FetchAPI, FetchArgs, RequiredError, FetchParamCreator, fetchData } from "@/tools/fetch"

const BASE_PATH = import.meta.env.VUE_APP_INFR_PROJECT_SERVER.replace(/\/+$/, "")

/**
 * 
 * @export
 * @interface CreateResourceRequest
 */
 export interface CreateResourceRequest {
    /**
     * 
     * @type {string}
     * @memberof CreateResourceRequest
     */
    data: string
    /**
     * 
     * @type {string}
     * @memberof CreateResourceRequest
     */
    name: string
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateResourceRequest
     */
    tags: Array<string>
    /**
     * 
     * @type {string}
     * @memberof CreateResourceRequest
     */
    type: ResourceTypeEnum
}

/**
 * 
 * @export
 * @interface CreateResourceResponse
 */
 export interface CreateResourceResponse {
    /**
     * 
     * @type {string}
     * @memberof CreateResourceResponse
     */
    id: string
}

/**
 * 
 * @export
 * @interface UpdateResourceRequest
 */
 export interface UpdateResourceRequest {
    /**
     * 
     * @type {string}
     * @memberof UpdateResourceRequest
     */
    data: string
    /**
     * 
     * @type {string}
     * @memberof UpdateResourceRequest
     */
    name: string
    /**
     * 
     * @type {Array<string>}
     * @memberof UpdateResourceRequest
     */
    tags: Array<string>
}

/**
 * 
 * @export
 * @interface ResourceView
 */
 export interface ResourceView {
    /**
     * 
     * @type {string}
     * @memberof ResourceView
     */
    created_at: string
    /**
     * 
     * @type {string}
     * @memberof ResourceView
     */
    id: string
    /**
     * 
     * @type {boolean}
     * @memberof ResourceView
     */
    is_deleted: boolean
    /**
     * 
     * @type {string}
     * @memberof ResourceView
     */
    name: string
    /**
     * 
     * @type {string}
     * @memberof ResourceView
     */
    type: string
    /**
     * 
     * @type {string}
     * @memberof ResourceView
     */
    data: string
    /**
     * 
     * @type {string}
     * @memberof ResourceView
     */
    updated_at: string
    /**
     * 
     * @type {number}
     * @memberof ResourceView
     */
    version: number
    /**
     * 
     * @type {Array<string>}
     * @memberof ResourceView
     */
    tags: Array<string>
}

/**
 * 
 * @export
 * @interface ResourceViewDetail
 */
 export interface ResourceViewDetail {
    /**
     * 
     * @type {string}
     * @memberof ResourceViewDetail
     */
    created_at: string
    /**
     * 
     * @type {string}
     * @memberof ResourceViewDetail
     */
    id: string
    /**
     * 
     * @type {boolean}
     * @memberof ResourceViewDetail
     */
    is_deleted: boolean
    /**
     * 
     * @type {string}
     * @memberof ResourceViewDetail
     */
    name: string
    /**
     * 
     * @type {string}
     * @memberof ResourceViewDetail
     */
    type: string
    /**
     * 
     * @type {string}
     * @memberof ResourceViewDetail
     */
    data: string
    /**
     * 
     * @type {string}
     * @memberof ResourceViewDetail
     */
    updated_at: string
    /**
     * 
     * @type {number}
     * @memberof ResourceViewDetail
     */
    version: number
    /**
     * 
     * @type {Array<string>}
     * @memberof ResourceViewDetail
     */
    tags: Array<string>
}

/**
 * @export
 * @enum {string}
 */
export enum ResourceTypeEnum {
    DrawIO = <any>'DrawIO',
    Markdown = <any>'Markdown',
    Excalidraw = <any>'Excalidraw',
    Plate = <any>'Plate'
}


/**
 * ResourceApi - fetch parameter creator
 * @export
 */
export const ResourceApiFetchParamCreator = (configuration?: any) => {
    return {
        /**
         * get all resources
         * @summary get all resources
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceGet(options: any = {}): FetchArgs {
            const path = new URL(BASE_PATH + `/api/v1/resource`)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'GET', undefined, options)
        },
        /**
         * delete resource
         * @summary delete resource
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdDelete(id: string, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1ResourceIdDelete.')
            }
            const localVarPath = `/api/v1/resource/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))

            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'DELETE', undefined, options)
        },
        /**
         * get resource
         * @summary get resource
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdGet(id: string, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1ResourceIdGet.')
            }
            const localVarPath = `/api/v1/resource/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))

            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'GET', undefined, options)
        },
        /**
         * get resource history
         * @summary get resource history
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdHistoryGet(id: string, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1ResourceIdHistoryGet.')
            }
            const localVarPath = `/api/v1/resource/{id}/history`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))

            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'GET', undefined, options)
        },
        /**
         * update resource
         * @summary update resource
         * @param {UpdateResourceRequest} body Request body
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdPut(body: UpdateResourceRequest, id: string, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1ResourceIdPut.')
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1ResourceIdPut.')
            }
            const localVarPath = `/api/v1/resource/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))

            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'PUT', body, options)
        },
        /**
         * create resource
         * @summary create resource
         * @param {CreateResourceRequest} body Request body
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourcePost(body: CreateResourceRequest, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1ResourcePost.')
            }
            const localVarPath = `/api/v1/resource`

            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'POST', body, options)
        },
    }
}

/**
 * ResourceApi - functional programming interface
 * @export
 */
export const ResourceApiFp = (configuration?: any) => {
    const fetchParamsCreator = ResourceApiFetchParamCreator(configuration)
    return {
        /**
         * get all resources
         * @summary get all resources
         * @param {*} [options] Override http request option.
         */
        v1ResourceGet: (options?: any) => () => fetchData<ResourceView[]>(fetchParamsCreator.v1ResourceGet(options)),

        /**
         * delete resource
         * @summary delete resource
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         */
        v1ResourceIdDelete: (id: string, options?: any) => () => fetchData<string>(fetchParamsCreator.v1ResourceIdDelete(id, options)),

        /**
         * get resource
         * @summary get resource
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         */
        v1ResourceIdGet: (id: string, options?: any) => () => fetchData<ResourceViewDetail>(fetchParamsCreator.v1ResourceIdGet(id, options)),

        /**
         * get resource history
         * @summary get resource history
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         */
        v1ResourceIdHistoryGet: (id: string, options?: any) => () => fetchData<ResourceViewDetail[]>(fetchParamsCreator.v1ResourceIdHistoryGet(id, options)),

        /**
         * update resource
         * @summary update resource
         * @param {UpdateResourceRequest} body Request body
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option. 
         */
        v1ResourceIdPut: (body: UpdateResourceRequest, id: string, options?: any) => () => fetchData<string>(fetchParamsCreator.v1ResourceIdPut(body, id, options)),

        /**
         * create resource
         * @summary create resource
         * @param {CreateResourceRequest} body Request body
         * @param {*} [options] Override http request option. 
         */
        v1ResourcePost: (body: CreateResourceRequest, options?: any) => () => fetchData<CreateResourceResponse>(fetchParamsCreator.v1ResourcePost(body, options)),

    }
}

/**
 * ResourceApi - factory interface
 * @export
 */
export const ResourceApiFactory = (configuration?: any) => {
    return {
        /**
         * get all resources
         * @summary get all resources
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceGet(options?: any) {
            return ResourceApiFp(configuration).v1ResourceGet(options)()
        },
        /**
         * delete resource
         * @summary delete resource
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdDelete(id: string, options?: any) {
            return ResourceApiFp(configuration).v1ResourceIdDelete(id, options)()
        },
        /**
         * get resource
         * @summary get resource
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdGet(id: string, options?: any) {
            return ResourceApiFp(configuration).v1ResourceIdGet(id, options)()
        },
        /**
         * get resource history
         * @summary get resource history
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdHistoryGet(id: string, options?: any) {
            return ResourceApiFp(configuration).v1ResourceIdHistoryGet(id, options)()
        },
        /**
         * update resource
         * @summary update resource
         * @param {UpdateResourceRequest} body Request body
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdPut(body: UpdateResourceRequest, id: string, options?: any) {
            return ResourceApiFp(configuration).v1ResourceIdPut(body, id, options)()
        },
        /**
         * create resource
         * @summary create resource
         * @param {CreateResourceRequest} body Request body
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourcePost(body: CreateResourceRequest, options?: any) {
            return ResourceApiFp(configuration).v1ResourcePost(body, options)()
        },
    }
}

/**
 * ResourceApi - object-oriented interface
 * @export
 * @class ResourceApi
 * @extends {BaseAPI}
 */
export class ResourceApi extends BaseAPI {
    constructor() {
        super(BASE_PATH)
    }
    /**
    * get all resources
    * @summary get all resources
    * @param {*} [options] Override http request option.
    * @throws {RequiredError}
    * @memberof ResourceApi
    */
    public v1ResourceGet(options?: any) {
        return ResourceApiFp(this.configuration).v1ResourceGet(options)()
    }

    /**
     * delete resource
     * @summary delete resource
     * @param {string} id Resource ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ResourceApi
     */
    public v1ResourceIdDelete(id: string, options?: any) {
        return ResourceApiFp(this.configuration).v1ResourceIdDelete(id, options)()
    }

    /**
     * get resource
     * @summary get resource
     * @param {string} id Resource ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ResourceApi
     */
    public v1ResourceIdGet(id: string, options?: any) {
        return ResourceApiFp(this.configuration).v1ResourceIdGet(id, options)()
    }

    /**
     * get resource history
     * @summary get resource history
     * @param {string} id Resource ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ResourceApi
     */
    public v1ResourceIdHistoryGet(id: string, options?: any) {
        return ResourceApiFp(this.configuration).v1ResourceIdHistoryGet(id, options)()
    }

    /**
     * update resource
     * @summary update resource
     * @param {UpdateResourceRequest} body Request body
     * @param {string} id Resource ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ResourceApi
     */
    public v1ResourceIdPut(body: UpdateResourceRequest, id: string, options?: any) {
        return ResourceApiFp(this.configuration).v1ResourceIdPut(body, id, options)()
    }

    /**
     * create resource
     * @summary create resource
     * @param {CreateResourceRequest} body Request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ResourceApi
     */
    public v1ResourcePost(body: CreateResourceRequest, options?: any) {
        return ResourceApiFp(this.configuration).v1ResourcePost(body, options)()
    }
}