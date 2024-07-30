import * as url from "url"

export const isomorphicFetch = fetch
const BASE_PATH = import.meta.env.REACT_APP_INFR_PROJECT_SERVER.replace(/\/+$/, "")

/**
 *
 * @export
 * @interface FetchAPI
 */
export interface FetchAPI {
    (url: string, init?: any): Promise<Response>
}

/**
 *
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
    url: string
    options: any
}

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
    name = "RequiredError"
    constructor(public field: string, msg?: string) {
        super(msg);
    }
}

/**
 *
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
    protected configuration: any

    constructor(configuration?: any, protected basePath: string = BASE_PATH, protected fetch: FetchAPI = isomorphicFetch) {
        if (configuration) {
            this.configuration = configuration
            this.basePath = configuration.basePath || this.basePath
        }
    }
}

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
        }
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
        v1ResourceGet(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Array<ViewmodelsResourceView>> {
            const localVarFetchArgs = ResourceApiFetchParamCreator(configuration).v1ResourceGet(options)
            return async (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                const response = await fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options)
                if (response.status >= 200 && response.status < 300) {
                    return response.json()
                } else {
                    throw response
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
    }
}

/**
 * ResourceApi - object-oriented interface
 * @export
 * @class ResourceApi
 * @extends {BaseAPI}
 */
export class ResourceApi extends BaseAPI {
    /**
     * get all resources
     * @summary get all resources
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ResourceApi
     */
    public v1ResourceGet(options?: any) {
        return ResourceApiFp(this.configuration).v1ResourceGet(options)(this.fetch, this.basePath)
    }

}