import { BaseAPI, FetchAPI, FetchArgs, isomorphicFetch, RequiredError } from "@/tools/fetch"
import * as url from "url"


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
    type?: ViewmodelsCreateResourceRequest.TypeEnum
}

/**
 * @export
 * @namespace ViewmodelsCreateResourceRequest
 */
export namespace ViewmodelsCreateResourceRequest {
    /**
     * @export
     * @enum {string}
     */
    export enum TypeEnum {
        DrawIO = <any>'DrawIO',
        Markdown = <any>'Markdown',
        Excalidraw = <any>'Excalidraw',
        Plate = <any>'Plate'
    }
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
            const localVarPath = `/v1/resource`
            const localVarUrlObj = url.parse(localVarPath, true)
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options)
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query)
            localVarUrlObj.search = null
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            }
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
            const localVarUrlObj = url.parse(localVarPath, true)
            const localVarRequestOptions = Object.assign({ method: 'DELETE' }, options)
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query)
            localVarUrlObj.search = null
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            }
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
            const localVarUrlObj = url.parse(localVarPath, true)
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options)
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query)
            localVarUrlObj.search = null
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            }
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
            const localVarUrlObj = url.parse(localVarPath, true)
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options)
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query)
            localVarUrlObj.search = null
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            }
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
            const localVarUrlObj = url.parse(localVarPath, true)
            const localVarRequestOptions = Object.assign({ method: 'PUT' }, options)
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            localVarHeaderParameter['Content-Type'] = 'application/json'

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query)
            localVarUrlObj.search = null
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)
            const needsSerialization = (<any>"ViewmodelsUpdateResourceRequest" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json'
            localVarRequestOptions.body = needsSerialization ? JSON.stringify(body || {}) : (body || "")

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            }
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
            const localVarUrlObj = url.parse(localVarPath, true)
            const localVarRequestOptions = Object.assign({ method: 'POST' }, options)
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any

            localVarHeaderParameter['Content-Type'] = 'application/json'

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query)
            localVarUrlObj.search = null
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)
            const needsSerialization = (<any>"ViewmodelsCreateResourceRequest" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json'
            localVarRequestOptions.body = needsSerialization ? JSON.stringify(body || {}) : (body || "")

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            }
        },
    }
}

/**
 * ResourceApi - functional programming interface
 * @export
 */
export const ResourceApiFp = (configuration?: any) => {
    return {
        /**
         * get all resources
         * @summary get all resources
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceGet(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<{ data?: ViewmodelsResourceView[], error?: any }> {
            const localVarFetchArgs = ResourceApiFetchParamCreator(configuration).v1ResourceGet(options)
            return async (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                try {
                    const response = await fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options)
                    if (response.status >= 200 && response.status < 300) {
                        const data = await response.json()
                        return { data }
                    } else {
                        const error = await response.json()
                        return { error }
                    }
                } catch (error) {
                    return { error }
                }
            }
        },
        /**
         * delete resource
         * @summary delete resource
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdDelete(id: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<{ data?: string, error?: any }> {
            const localVarFetchArgs = ResourceApiFetchParamCreator(configuration).v1ResourceIdDelete(id, options)
            return async (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                try {
                    const response = await fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options)
                    if (response.status >= 200 && response.status < 300) {
                        const data = await response.json()
                        return { data }
                    } else {
                        const error = await response.json()
                        return { error }
                    }
                } catch (error) {
                    return { error }
                }
            }
        },
        /**
         * get resource
         * @summary get resource
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdGet(id: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<{ data?: ViewmodelsResourceView, error?: any }> {
            const localVarFetchArgs = ResourceApiFetchParamCreator(configuration).v1ResourceIdGet(id, options)
            return async (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                try {
                    const response = await fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options)
                    if (response.status >= 200 && response.status < 300) {
                        const data = await response.json()
                        return { data }
                    } else {
                        const error = await response.json()
                        return { error }
                    }
                } catch (error) {
                    return { error }
                }
            }
        },
        /**
         * get resource history
         * @summary get resource history
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdHistoryGet(id: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<{ data?: ViewmodelsResourceView[], error?: any }> {
            const localVarFetchArgs = ResourceApiFetchParamCreator(configuration).v1ResourceIdHistoryGet(id, options)
            return async (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                try {
                    const response = await fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options)
                    if (response.status >= 200 && response.status < 300) {
                        const data = await response.json()
                        return { data }
                    } else {
                        const error = await response.json()
                        return { error }
                    }
                } catch (error) {
                    return { error }
                }
            }
        },
        /**
         * update resource
         * @summary update resource
         * @param {ViewmodelsUpdateResourceRequest} body Request body
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdPut(body: ViewmodelsUpdateResourceRequest, id: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<{ data?: string, error?: any }> {
            const localVarFetchArgs = ResourceApiFetchParamCreator(configuration).v1ResourceIdPut(body, id, options)
            return async (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                try {
                    const response = await fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options)
                    if (response.status >= 200 && response.status < 300) {
                        const data = await response.json()
                        return { data }
                    } else {
                        const error = await response.json()
                        return { error }
                    }
                } catch (error) {
                    return { error }
                }
            }
        },
        /**
         * create resource
         * @summary create resource
         * @param {ViewmodelsCreateResourceRequest} body Request body
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourcePost(body: ViewmodelsCreateResourceRequest, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<{ data?: ViewmodelsCreateResourceResponse, error?: any }> {
            const localVarFetchArgs = ResourceApiFetchParamCreator(configuration).v1ResourcePost(body, options)
            return async (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                try {
                    const response = await fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options)
                    if (response.status >= 200 && response.status < 300) {
                        const data = await response.json()
                        return { data }
                    } else {
                        const error = await response.json()
                        return { error }
                    }
                } catch (error) {
                    return { error }
                }
            }
        },
    }
}

/**
 * ResourceApi - factory interface
 * @export
 */
export const ResourceApiFactory = (configuration?: any, fetch?: FetchAPI, basePath?: string) => {
    return {
        /**
         * get all resources
         * @summary get all resources
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceGet(options?: any) {
            return ResourceApiFp(configuration).v1ResourceGet(options)(fetch, basePath)
        },
        /**
         * delete resource
         * @summary delete resource
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdDelete(id: string, options?: any) {
            return ResourceApiFp(configuration).v1ResourceIdDelete(id, options)(fetch, basePath)
        },
        /**
         * get resource
         * @summary get resource
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdGet(id: string, options?: any) {
            return ResourceApiFp(configuration).v1ResourceIdGet(id, options)(fetch, basePath)
        },
        /**
         * get resource history
         * @summary get resource history
         * @param {string} id Resource ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourceIdHistoryGet(id: string, options?: any) {
            return ResourceApiFp(configuration).v1ResourceIdHistoryGet(id, options)(fetch, basePath)
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
            return ResourceApiFp(configuration).v1ResourceIdPut(body, id, options)(fetch, basePath)
        },
        /**
         * create resource
         * @summary create resource
         * @param {ViewmodelsCreateResourceRequest} body Request body
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1ResourcePost(body: ViewmodelsCreateResourceRequest, options?: any) {
            return ResourceApiFp(configuration).v1ResourcePost(body, options)(fetch, basePath)
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
    constructor(protected basePath: string, protected fetch: FetchAPI, configuration?: any) {
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
        return ResourceApiFp(this.configuration).v1ResourceGet(options)(this.fetch, this.basePath);
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
        return ResourceApiFp(this.configuration).v1ResourceIdDelete(id, options)(this.fetch, this.basePath);
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
        return ResourceApiFp(this.configuration).v1ResourceIdGet(id, options)(this.fetch, this.basePath);
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
        return ResourceApiFp(this.configuration).v1ResourceIdHistoryGet(id, options)(this.fetch, this.basePath);
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
        return ResourceApiFp(this.configuration).v1ResourceIdPut(body, id, options)(this.fetch, this.basePath);
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
        return ResourceApiFp(this.configuration).v1ResourcePost(body, options)(this.fetch, this.basePath);
    }
}