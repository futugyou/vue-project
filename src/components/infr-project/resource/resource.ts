import { BaseAPI, FetchAPI, FetchArgs, RequiredError, FetchParamCreator, fetchData } from "@/tools/fetch"

const BASE_PATH = import.meta.env.REACT_APP_INFR_PROJECT_SERVER.replace(/\/+$/, "")

/**
 * 
 * @export
 * @interface ViewmodelsResourceView
 */
export interface ViewmodelsResourceView {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsResourceView
     */
    createdAt?: string
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsResourceView
     */
    data?: string
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsResourceView
     */
    id?: string
    /**
     * 
     * @type {boolean}
     * @memberof ViewmodelsResourceView
     */
    isDeleted?: boolean
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsResourceView
     */
    name?: string
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsResourceView
     */
    type?: string
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsResourceView
     */
    updatedAt?: string
    /**
     * 
     * @type {number}
     * @memberof ViewmodelsResourceView
     */
    version?: number
}

/**
 * 
 * @export
 * @interface ViewmodelsUpdateResourceRequest
 */
export interface ViewmodelsUpdateResourceRequest {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdateResourceRequest
     */
    data: string
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdateResourceRequest
     */
    name: string
    /**
     * 
     * @type {Array<string>}
     * @memberof ViewmodelsUpdateResourceRequest
     */
    tags?: Array<string>
}

/**
 * 
 * @export
 * @interface ViewmodelsCreateResourceRequest
 */
export interface ViewmodelsCreateResourceRequest {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsCreateResourceRequest
     */
    data: string
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsCreateResourceRequest
     */
    name: string
    /**
     * 
     * @type {Array<string>}
     * @memberof ViewmodelsCreateResourceRequest
     */
    tags?: Array<string>
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsCreateResourceRequest
     */
    type?: ResourceTypeEnum
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
 * 
 * @export
 * @interface ViewmodelsCreateResourceResponse
 */
export interface ViewmodelsCreateResourceResponse {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsCreateResourceResponse
     */
    id?: string
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
            const path = new URL(BASE_PATH + `/v1/resource`)
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
            const localVarPath = `/v1/resource/{id}`
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
            const localVarPath = `/v1/resource/{id}`
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
            const localVarPath = `/v1/resource/{id}/history`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))

            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'GET', undefined, options)
        },
        /**
         * update resource
         * @summary update resource
         * @param {ViewmodelsUpdateResourceRequest} body Request body
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdPut(body: ViewmodelsUpdateResourceRequest, id: string, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1ResourceIdPut.')
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1ResourceIdPut.')
            }
            const localVarPath = `/v1/resource/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))

            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'PUT', body, options)
        },
        /**
         * create resource
         * @summary create resource
         * @param {ViewmodelsCreateResourceRequest} body Request body
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourcePost(body: ViewmodelsCreateResourceRequest, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1ResourcePost.')
            }
            const localVarPath = `/v1/resource`

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
        v1ResourceGet: (options?: any) => () => fetchData<ViewmodelsResourceView[]>(fetchParamsCreator.v1ResourceGet(options)),

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
        v1ResourceIdGet: (id: string, options?: any) => () => fetchData<ViewmodelsResourceView>(fetchParamsCreator.v1ResourceIdGet(id, options)),

        /**
         * get resource history
         * @summary get resource history
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         */
        v1ResourceIdHistoryGet: (id: string, options?: any) => () => fetchData<ViewmodelsResourceView[]>(fetchParamsCreator.v1ResourceIdHistoryGet(id, options)),

        /**
         * update resource
         * @summary update resource
         * @param {ViewmodelsUpdateResourceRequest} body Request body
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option. 
         */
        v1ResourceIdPut: (body: ViewmodelsUpdateResourceRequest, id: string, options?: any) => () => fetchData<string>(fetchParamsCreator.v1ResourceIdPut(body, id, options)),

        /**
         * create resource
         * @summary create resource
         * @param {ViewmodelsCreateResourceRequest} body Request body
         * @param {*} [options] Override http request option. 
         */
        v1ResourcePost: (body: ViewmodelsCreateResourceRequest, options?: any) => () => fetchData<ViewmodelsCreateResourceResponse>(fetchParamsCreator.v1ResourcePost(body, options)),

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
         * @param {ViewmodelsUpdateResourceRequest} body Request body
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdPut(body: ViewmodelsUpdateResourceRequest, id: string, options?: any) {
            return ResourceApiFp(configuration).v1ResourceIdPut(body, id, options)()
        },
        /**
         * create resource
         * @summary create resource
         * @param {ViewmodelsCreateResourceRequest} body Request body
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourcePost(body: ViewmodelsCreateResourceRequest, options?: any) {
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
     * @param {ViewmodelsUpdateResourceRequest} body Request body
     * @param {string} id Resource ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ResourceApi
     */
    public v1ResourceIdPut(body: ViewmodelsUpdateResourceRequest, id: string, options?: any) {
        return ResourceApiFp(this.configuration).v1ResourceIdPut(body, id, options)()
    }

    /**
     * create resource
     * @summary create resource
     * @param {ViewmodelsCreateResourceRequest} body Request body
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ResourceApi
     */
    public v1ResourcePost(body: ViewmodelsCreateResourceRequest, options?: any) {
        return ResourceApiFp(this.configuration).v1ResourcePost(body, options)()
    }
}