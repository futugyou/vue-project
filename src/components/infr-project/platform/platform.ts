import { BaseAPI, FetchAPI, FetchArgs, RequiredError, FetchParamCreator, fetchData } from "@/tools/fetch"

const BASE_PATH = import.meta.env.VUE_APP_INFR_PROJECT_SERVER.replace(/\/+$/, "")

/**
 * 
 * @export
 * @interface ViewmodelsUpdatePlatformProjectRequest
 */
export interface ViewmodelsUpdatePlatformProjectRequest {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdatePlatformProjectRequest
     */
    name: string
    /**
     * 
     * @type {{ [key: string]: string }}
     * @memberof ViewmodelsUpdatePlatformProjectRequest
     */
    property?: { [key: string]: string }
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdatePlatformProjectRequest
     */
    url: string
}

/**
 * 
 * @export
 * @interface ViewmodelsUpdatePlatformWebhookRequest
 */
export interface ViewmodelsUpdatePlatformWebhookRequest {
    /**
     * 
     * @type {boolean}
     * @memberof ViewmodelsUpdatePlatformWebhookRequest
     */
    activate: boolean
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdatePlatformWebhookRequest
     */
    name: string
    /**
     * 
     * @type {{ [key: string]: string }}
     * @memberof ViewmodelsUpdatePlatformWebhookRequest
     */
    property?: { [key: string]: string }
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdatePlatformWebhookRequest
     */
    state?: WebhookStateEnum
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdatePlatformWebhookRequest
     */
    url: string
}

/**
 * 
 * @export
 * @interface ViewmodelsUpdatePlatformRequest
 */
export interface ViewmodelsUpdatePlatformRequest {
    /**
     * 
     * @type {boolean}
     * @memberof ViewmodelsUpdatePlatformRequest
     */
    activate?: boolean
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdatePlatformRequest
     */
    name: string
    /**
     * 
     * @type {Array<ViewmodelsPropertyInfo>}
     * @memberof ViewmodelsUpdatePlatformRequest
     */
    property?: Array<ViewmodelsPropertyInfo>
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdatePlatformRequest
     */
    rest: string
    /**
     * 
     * @type {Array<string>}
     * @memberof ViewmodelsUpdatePlatformRequest
     */
    tags?: Array<string>
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdatePlatformRequest
     */
    url: string
}

/**
 * 
 * @export
 * @interface ViewmodelsPropertyInfo
 */
export interface ViewmodelsPropertyInfo {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsPropertyInfo
     */
    key?: string
    /**
     * 
     * @type {boolean}
     * @memberof ViewmodelsPropertyInfo
     */
    needMask?: boolean
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsPropertyInfo
     */
    value?: string
}

/**
 * @export
 * @enum {string}
 */
export enum WebhookStateEnum {
    Init = <any>'Init',
    Creating = <any>'Creating',
    Ready = <any>'Ready'
}


/**
 * 
 * @export
 * @interface ViewmodelsPlatformView
 */
export interface ViewmodelsPlatformView {
    /**
     * 
     * @type {boolean}
     * @memberof ViewmodelsPlatformView
     */
    activate?: boolean
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsPlatformView
     */
    id?: string
    /**
     * 
     * @type {boolean}
     * @memberof ViewmodelsPlatformView
     */
    is_deleted?: boolean
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsPlatformView
     */
    name?: string
    /**
     * 
     * @type {Array<ViewmodelsPlatformProject>}
     * @memberof ViewmodelsPlatformView
     */
    projects?: Array<ViewmodelsPlatformProject>
    /**
     * 
     * @type {Array<ViewmodelsPropertyInfo>}
     * @memberof ViewmodelsPlatformView
     */
    property?: Array<ViewmodelsPropertyInfo>
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsPlatformView
     */
    rest_endpoint?: string
    /**
     * 
     * @type {Array<string>}
     * @memberof ViewmodelsPlatformView
     */
    tags?: Array<string>
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsPlatformView
     */
    url?: string
}

/**
 * 
 * @export
 * @interface ViewmodelsPlatformProject
 */
export interface ViewmodelsPlatformProject {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsPlatformProject
     */
    id?: string
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsPlatformProject
     */
    name?: string
    /**
     * 
     * @type {{ [key: string]: string }}
     * @memberof ViewmodelsPlatformProject
     */
    property?: { [key: string]: string }
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsPlatformProject
     */
    url?: string
    /**
     * 
     * @type {Array<ViewmodelsWebhook>}
     * @memberof ViewmodelsPlatformProject
     */
    webhooks?: Array<ViewmodelsWebhook>
}

/**
 * 
 * @export
 * @interface ViewmodelsWebhook
 */
export interface ViewmodelsWebhook {
    /**
     * 
     * @type {boolean}
     * @memberof ViewmodelsWebhook
     */
    activate?: boolean
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsWebhook
     */
    name?: string
    /**
     * 
     * @type {{ [key: string]: string }}
     * @memberof ViewmodelsWebhook
     */
    property?: { [key: string]: string }
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsWebhook
     */
    state?: string
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsWebhook
     */
    url?: string
}

/**
 * 
 * @export
 * @interface ViewmodelsCreatePlatformRequest
 */
export interface ViewmodelsCreatePlatformRequest {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsCreatePlatformRequest
     */
    name: string
    /**
     * 
     * @type {Array<ViewmodelsPropertyInfo>}
     * @memberof ViewmodelsCreatePlatformRequest
     */
    property?: Array<ViewmodelsPropertyInfo>
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsCreatePlatformRequest
     */
    rest: string
    /**
     * 
     * @type {Array<string>}
     * @memberof ViewmodelsCreatePlatformRequest
     */
    tags?: Array<string>
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsCreatePlatformRequest
     */
    url: string
}

/**
 * PlatformApi - fetch parameter creator
 * @export
 */
export const PlatformApiFetchParamCreator = function (configuration?: any) {
    return {
        /**
         * get all platform
         * @summary get all platform
         * @param {*} [options] Override http request option.
         */
        v1PlatformGet(options: any = {}): FetchArgs {
            const localVarPath = `/api/v1/platform`
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'GET', undefined, options)
        },
        /**
         * delete platform
         * @summary delete platform
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdDelete(id: string, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1PlatformIdDelete.')
            }
            const localVarPath = `/api/v1/platform/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'DELETE', undefined, options)
        },
        /**
         * get platform
         * @summary get platform
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdGet(id: string, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1PlatformIdGet.')
            }
            const localVarPath = `/api/v1/platform/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'GET', undefined, options)
        },
        /**
         * create platform webhook
         * @summary create platform webhook
         * @param {ViewmodelsUpdatePlatformProjectRequest} body Request body
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectPost(body: ViewmodelsUpdatePlatformProjectRequest, id: string, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1PlatformIdProjectPost.')
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1PlatformIdProjectPost.')
            }
            const localVarPath = `/api/v1/platform/{id}/project`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'POST', body, options)
        },
        /**
         * delete platform project
         * @summary delete platform project
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdDelete(id: string, projectId: string, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1PlatformIdProjectProjectIdDelete.')
            }
            // verify required parameter 'projectId' is not null or undefined
            if (projectId === null || projectId === undefined) {
                throw new RequiredError('projectId', 'Required parameter projectId was null or undefined when calling v1PlatformIdProjectProjectIdDelete.')
            }
            const localVarPath = `/api/v1/platform/{id}/project/{project_id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
                .replace(`{${"project_id"}}`, encodeURIComponent(String(projectId)))
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'DELETE', undefined, options)
        },
        /**
         * update platform webhook
         * @summary update platform webhook
         * @param {ViewmodelsUpdatePlatformWebhookRequest} body Request body
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdHookPut(body: ViewmodelsUpdatePlatformWebhookRequest, id: string, projectId: string, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1PlatformIdProjectProjectIdHookPut.')
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1PlatformIdProjectProjectIdHookPut.')
            }
            // verify required parameter 'projectId' is not null or undefined
            if (projectId === null || projectId === undefined) {
                throw new RequiredError('projectId', 'Required parameter projectId was null or undefined when calling v1PlatformIdProjectProjectIdHookPut.')
            }
            const localVarPath = `/api/v1/platform/{id}/project/{project_id}/hook`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
                .replace(`{${"project_id"}}`, encodeURIComponent(String(projectId)))
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'PUT', body, options)
        },
        /**
         * update platform project
         * @summary update platform project
         * @param {ViewmodelsUpdatePlatformProjectRequest} body Request body
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdPut(body: ViewmodelsUpdatePlatformProjectRequest, id: string, projectId: string, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1PlatformIdProjectProjectIdPut.')
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1PlatformIdProjectProjectIdPut.')
            }
            // verify required parameter 'projectId' is not null or undefined
            if (projectId === null || projectId === undefined) {
                throw new RequiredError('projectId', 'Required parameter projectId was null or undefined when calling v1PlatformIdProjectProjectIdPut.')
            }
            const localVarPath = `/api/v1/platform/{id}/project/{project_id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
                .replace(`{${"project_id"}}`, encodeURIComponent(String(projectId)))
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'PUT', body, options)
        },
        /**
         * update platform
         * @summary update platform
         * @param {ViewmodelsUpdatePlatformRequest} body Request body
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdPut(body: ViewmodelsUpdatePlatformRequest, id: string, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1PlatformIdPut.')
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1PlatformIdPut.')
            }
            const localVarPath = `/api/v1/platform/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'PUT', body, options)
        },
        /**
         * create platform
         * @summary create platform
         * @param {ViewmodelsCreatePlatformRequest} body Request body
         * @param {*} [options] Override http request option.
         */
        v1PlatformPost(body: ViewmodelsCreatePlatformRequest, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1PlatformPost.')
            }
            const localVarPath = `/api/v1/platform`
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'POST', body, options)
        },
    }
}

/**
 * PlatformApi - functional programming interface
 * @export
 */
export const PlatformApiFp = function (configuration?: any) {
    const fetchParamsCreator = PlatformApiFetchParamCreator(configuration)
    return {
        /**
         * get all platform
         * @summary get all platform
         * @param {*} [options] Override http request option.
         */
        v1PlatformGet: (options?: any) => () => fetchData<ViewmodelsPlatformView[]>(fetchParamsCreator.v1PlatformGet(options)),

        /**
         * delete platform
         * @summary delete platform
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdDelete: (id: string, options?: any) => () => fetchData<ViewmodelsPlatformView>(fetchParamsCreator.v1PlatformIdDelete(id, options)),

        /**
         * get platform
         * @summary get platform
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdGet: (id: string, options?: any) => () => fetchData<ViewmodelsPlatformView>(fetchParamsCreator.v1PlatformIdGet(id, options)),

        /**
         * create platform webhook
         * @summary create platform webhook
         * @param {ViewmodelsUpdatePlatformProjectRequest} body Request body
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectPost: (body: ViewmodelsUpdatePlatformProjectRequest, id: string, options?: any) => () => fetchData<ViewmodelsPlatformView>(fetchParamsCreator.v1PlatformIdProjectPost(body, id, options)),

        /**
         * delete platform project
         * @summary delete platform project
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdDelete: (id: string, projectId: string, options?: any) => () => fetchData<ViewmodelsPlatformView>(fetchParamsCreator.v1PlatformIdProjectProjectIdDelete(id, projectId, options)),

        /**
         * update platform webhook
         * @summary update platform webhook
         * @param {ViewmodelsUpdatePlatformWebhookRequest} body Request body
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdHookPut: (body: ViewmodelsUpdatePlatformWebhookRequest, id: string, projectId: string, options?: any) => () => fetchData<ViewmodelsPlatformView>(fetchParamsCreator.v1PlatformIdProjectProjectIdHookPut(body, id, projectId, options)),

        /**
         * update platform project
         * @summary update platform project
         * @param {ViewmodelsUpdatePlatformProjectRequest} body Request body
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdPut: (body: ViewmodelsUpdatePlatformProjectRequest, id: string, projectId: string, options?: any) => () => fetchData<ViewmodelsPlatformView>(fetchParamsCreator.v1PlatformIdProjectProjectIdPut(body, id, projectId, options)),

        /**
         * update platform
         * @summary update platform
         * @param {ViewmodelsUpdatePlatformRequest} body Request body
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdPut: (body: ViewmodelsUpdatePlatformRequest, id: string, options?: any) => () => fetchData<ViewmodelsPlatformView>(fetchParamsCreator.v1PlatformIdPut(body, id, options)),

        /**
         * create platform
         * @summary create platform
         * @param {ViewmodelsCreatePlatformRequest} body Request body
         * @param {*} [options] Override http request option.
         */
        v1PlatformPost: (body: ViewmodelsCreatePlatformRequest, options?: any) => () => fetchData<ViewmodelsPlatformView>(fetchParamsCreator.v1PlatformPost(body, options)),

    }
}

/**
 * PlatformApi - factory interface
 * @export
 */
export const PlatformApiFactory = function (configuration?: any, fetch?: FetchAPI, basePath?: string) {
    return {
        /**
         * get all platform
         * @summary get all platform
         * @param {*} [options] Override http request option.
         */
        v1PlatformGet(options?: any) {
            return PlatformApiFp(configuration).v1PlatformGet(options)()
        },
        /**
         * delete platform
         * @summary delete platform
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdDelete(id: string, options?: any) {
            return PlatformApiFp(configuration).v1PlatformIdDelete(id, options)()
        },
        /**
         * get platform
         * @summary get platform
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdGet(id: string, options?: any) {
            return PlatformApiFp(configuration).v1PlatformIdGet(id, options)()
        },
        /**
         * create platform webhook
         * @summary create platform webhook
         * @param {ViewmodelsUpdatePlatformProjectRequest} body Request body
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectPost(body: ViewmodelsUpdatePlatformProjectRequest, id: string, options?: any) {
            return PlatformApiFp(configuration).v1PlatformIdProjectPost(body, id, options)()
        },
        /**
         * delete platform project
         * @summary delete platform project
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdDelete(id: string, projectId: string, options?: any) {
            return PlatformApiFp(configuration).v1PlatformIdProjectProjectIdDelete(id, projectId, options)()
        },
        /**
         * update platform webhook
         * @summary update platform webhook
         * @param {ViewmodelsUpdatePlatformWebhookRequest} body Request body
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdHookPut(body: ViewmodelsUpdatePlatformWebhookRequest, id: string, projectId: string, options?: any) {
            return PlatformApiFp(configuration).v1PlatformIdProjectProjectIdHookPut(body, id, projectId, options)()
        },
        /**
         * update platform project
         * @summary update platform project
         * @param {ViewmodelsUpdatePlatformProjectRequest} body Request body
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdPut(body: ViewmodelsUpdatePlatformProjectRequest, id: string, projectId: string, options?: any) {
            return PlatformApiFp(configuration).v1PlatformIdProjectProjectIdPut(body, id, projectId, options)()
        },
        /**
         * update platform
         * @summary update platform
         * @param {ViewmodelsUpdatePlatformRequest} body Request body
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdPut(body: ViewmodelsUpdatePlatformRequest, id: string, options?: any) {
            return PlatformApiFp(configuration).v1PlatformIdPut(body, id, options)()
        },
        /**
         * create platform
         * @summary create platform
         * @param {ViewmodelsCreatePlatformRequest} body Request body
         * @param {*} [options] Override http request option.
         */
        v1PlatformPost(body: ViewmodelsCreatePlatformRequest, options?: any) {
            return PlatformApiFp(configuration).v1PlatformPost(body, options)()
        },
    }
}

/**
 * PlatformApi - object-oriented interface
 * @export
 * @class PlatformApi
 * @extends {BaseAPI}
 */
export class PlatformApi extends BaseAPI {
    /**
     * get all platform
     * @summary get all platform
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformGet(options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformGet(options)()
    }

    /**
     * delete platform
     * @summary delete platform
     * @param {string} id Platform ID
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformIdDelete(id: string, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformIdDelete(id, options)()
    }

    /**
     * get platform
     * @summary get platform
     * @param {string} id Platform ID
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformIdGet(id: string, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformIdGet(id, options)()
    }

    /**
     * create platform webhook
     * @summary create platform webhook
     * @param {ViewmodelsUpdatePlatformProjectRequest} body Request body
     * @param {string} id Platform ID
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformIdProjectPost(body: ViewmodelsUpdatePlatformProjectRequest, id: string, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformIdProjectPost(body, id, options)()
    }

    /**
     * delete platform project
     * @summary delete platform project
     * @param {string} id Platform ID
     * @param {string} projectId Platform Project ID
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformIdProjectProjectIdDelete(id: string, projectId: string, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformIdProjectProjectIdDelete(id, projectId, options)()
    }

    /**
     * update platform webhook
     * @summary update platform webhook
     * @param {ViewmodelsUpdatePlatformWebhookRequest} body Request body
     * @param {string} id Platform ID
     * @param {string} projectId Platform Project ID
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformIdProjectProjectIdHookPut(body: ViewmodelsUpdatePlatformWebhookRequest, id: string, projectId: string, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformIdProjectProjectIdHookPut(body, id, projectId, options)()
    }

    /**
     * update platform project
     * @summary update platform project
     * @param {ViewmodelsUpdatePlatformProjectRequest} body Request body
     * @param {string} id Platform ID
     * @param {string} projectId Platform Project ID
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformIdProjectProjectIdPut(body: ViewmodelsUpdatePlatformProjectRequest, id: string, projectId: string, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformIdProjectProjectIdPut(body, id, projectId, options)()
    }

    /**
     * update platform
     * @summary update platform
     * @param {ViewmodelsUpdatePlatformRequest} body Request body
     * @param {string} id Platform ID
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformIdPut(body: ViewmodelsUpdatePlatformRequest, id: string, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformIdPut(body, id, options)()
    }

    /**
     * create platform
     * @summary create platform
     * @param {ViewmodelsCreatePlatformRequest} body Request body
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformPost(body: ViewmodelsCreatePlatformRequest, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformPost(body, options)()
    }

}
