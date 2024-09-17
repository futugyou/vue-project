import { BaseAPI, FetchAPI, FetchArgs, RequiredError, FetchParamCreator, fetchData } from "@/tools/fetch"

const BASE_PATH = import.meta.env.VUE_APP_INFR_PROJECT_SERVER.replace(/\/+$/, "")

/**
 * 
 * @export
 * @interface UpdatePlatformProjectRequest
 */
export interface UpdatePlatformProjectRequest {
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformProjectRequest
     */
    name: string
    /**
     * 
     * @type {{ [key: string]: string }}
     * @memberof UpdatePlatformProjectRequest
     */
    property?: { [key: string]: string }
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformProjectRequest
     */
    url: string
}

/**
 * 
 * @export
 * @interface UpdatePlatformWebhookRequest
 */
export interface UpdatePlatformWebhookRequest {
    /**
     * 
     * @type {boolean}
     * @memberof UpdatePlatformWebhookRequest
     */
    activate: boolean
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformWebhookRequest
     */
    name: string
    /**
     * 
     * @type {{ [key: string]: string }}
     * @memberof UpdatePlatformWebhookRequest
     */
    property?: { [key: string]: string }
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformWebhookRequest
     */
    state?: WebhookStateEnum
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformWebhookRequest
     */
    url: string
}

/**
 * 
 * @export
 * @interface UpdatePlatformRequest
 */
export interface UpdatePlatformRequest {
    /**
     * 
     * @type {boolean}
     * @memberof UpdatePlatformRequest
     */
    activate?: boolean
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformRequest
     */
    name: string
    /**
     * 
     * @type {Array<PropertyInfo>}
     * @memberof UpdatePlatformRequest
     */
    property?: Array<PropertyInfo>
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformRequest
     */
    rest: string
    /**
     * 
     * @type {Array<string>}
     * @memberof UpdatePlatformRequest
     */
    tags?: Array<string>
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformRequest
     */
    url: string
}

/**
 * 
 * @export
 * @interface PropertyInfo
 */
export interface PropertyInfo {
    /**
     * 
     * @type {string}
     * @memberof PropertyInfo
     */
    key: string
    /**
     * 
     * @type {boolean}
     * @memberof PropertyInfo
     */
    needMask: boolean
    /**
     * 
     * @type {string}
     * @memberof PropertyInfo
     */
    value: string
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
 * @interface PlatformView
 */
export interface PlatformView {
    /**
     * 
     * @type {boolean}
     * @memberof PlatformView
     */
    activate: boolean
    /**
     * 
     * @type {string}
     * @memberof PlatformView
     */
    id: string
    /**
     * 
     * @type {boolean}
     * @memberof PlatformView
     */
    is_deleted: boolean
    /**
     * 
     * @type {string}
     * @memberof PlatformView
     */
    name: string
    /**
     * 
     * @type {string}
     * @memberof PlatformView
     */
    rest_endpoint: string
    /**
     * 
     * @type {Array<string>}
     * @memberof PlatformView
     */
    tags?: Array<string>
    /**
     * 
     * @type {string}
     * @memberof PlatformView
     */
    url: string
}

/**
 * 
 * @export
 * @interface PlatformDetailView
 */
export interface PlatformDetailView {
    /**
     * 
     * @type {boolean}
     * @memberof PlatformDetailView
     */
    activate: boolean
    /**
     * 
     * @type {string}
     * @memberof PlatformDetailView
     */
    id: string
    /**
     * 
     * @type {boolean}
     * @memberof PlatformDetailView
     */
    is_deleted: boolean
    /**
     * 
     * @type {string}
     * @memberof PlatformDetailView
     */
    name: string
    /**
     * 
     * @type {Array<PlatformProject>}
     * @memberof PlatformDetailView
     */
    projects?: Array<PlatformProject>
    /**
     * 
     * @type {Array<PropertyInfo>}
     * @memberof PlatformDetailView
     */
    property?: Array<PropertyInfo>
    /**
     * 
     * @type {string}
     * @memberof PlatformDetailView
     */
    rest_endpoint: string
    /**
     * 
     * @type {Array<string>}
     * @memberof PlatformDetailView
     */
    tags?: Array<string>
    /**
     * 
     * @type {string}
     * @memberof PlatformDetailView
     */
    url: string
}

/**
 * 
 * @export
 * @interface PlatformProject
 */
export interface PlatformProject {
    /**
     * 
     * @type {string}
     * @memberof PlatformProject
     */
    id: string
    /**
     * 
     * @type {string}
     * @memberof PlatformProject
     */
    name: string
    /**
     * 
     * @type {{ [key: string]: string }}
     * @memberof PlatformProject
     */
    property?: { [key: string]: string }
    /**
     * 
     * @type {string}
     * @memberof PlatformProject
     */
    url: string
    /**
     * 
     * @type {Array<Webhook>}
     * @memberof PlatformProject
     */
    webhooks?: Array<Webhook>
}

/**
 * 
 * @export
 * @interface Webhook
 */
export interface Webhook {
    /**
     * 
     * @type {boolean}
     * @memberof Webhook
     */
    activate?: boolean
    /**
     * 
     * @type {string}
     * @memberof Webhook
     */
    name?: string
    /**
     * 
     * @type {{ [key: string]: string }}
     * @memberof Webhook
     */
    property?: { [key: string]: string }
    /**
     * 
     * @type {string}
     * @memberof Webhook
     */
    state?: string
    /**
     * 
     * @type {string}
     * @memberof Webhook
     */
    url?: string
}

/**
 * 
 * @export
 * @interface CreatePlatformRequest
 */
export interface CreatePlatformRequest {
    /**
     * 
     * @type {string}
     * @memberof CreatePlatformRequest
     */
    name: string
    /**
     * 
     * @type {Array<PropertyInfo>}
     * @memberof CreatePlatformRequest
     */
    property?: Array<PropertyInfo>
    /**
     * 
     * @type {string}
     * @memberof CreatePlatformRequest
     */
    rest: string
    /**
     * 
     * @type {Array<string>}
     * @memberof CreatePlatformRequest
     */
    tags?: Array<string>
    /**
     * 
     * @type {string}
     * @memberof CreatePlatformRequest
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
         * @param {UpdatePlatformProjectRequest} body Request body
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectPost(body: UpdatePlatformProjectRequest, id: string, options: any = {}): FetchArgs {
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
         * @param {UpdatePlatformWebhookRequest} body Request body
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdHookPut(body: UpdatePlatformWebhookRequest, id: string, projectId: string, options: any = {}): FetchArgs {
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
         * delete platform webhook
         * @summary delete platform webhook 
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {string} hook_name Platform Project Webhook Name
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdHookDelete(id: string, projectId: string, hook_name: string, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1PlatformIdProjectProjectIdHookDelete.')
            }
            // verify required parameter 'projectId' is not null or undefined
            if (projectId === null || projectId === undefined) {
                throw new RequiredError('projectId', 'Required parameter projectId was null or undefined when calling v1PlatformIdProjectProjectIdHookDelete.')
            }
            // verify required parameter 'hook_name' is not null or undefined
            if (hook_name === null || hook_name === undefined) {
                throw new RequiredError('hook_name', 'Required parameter hook_name was null or undefined when calling v1PlatformIdProjectProjectIdHookDelete.')
            }
            const localVarPath = `/api/v1/platform/{id}/project/{project_id}/hook/{hook_name}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
                .replace(`{${"project_id"}}`, encodeURIComponent(String(projectId)))
                .replace(`{${"hook_name"}}`, encodeURIComponent(String(hook_name)))
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'Delete', undefined, options)
        },
        /**
         * update platform project
         * @summary update platform project
         * @param {UpdatePlatformProjectRequest} body Request body
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdPut(body: UpdatePlatformProjectRequest, id: string, projectId: string, options: any = {}): FetchArgs {
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
         * @param {UpdatePlatformRequest} body Request body
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdPut(body: UpdatePlatformRequest, id: string, options: any = {}): FetchArgs {
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
         * @param {CreatePlatformRequest} body Request body
         * @param {*} [options] Override http request option.
         */
        v1PlatformPost(body: CreatePlatformRequest, options: any = {}): FetchArgs {
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
        v1PlatformGet: (options?: any) => () => fetchData<PlatformView[]>(fetchParamsCreator.v1PlatformGet(options)),

        /**
         * delete platform
         * @summary delete platform
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdDelete: (id: string, options?: any) => () => fetchData<PlatformDetailView>(fetchParamsCreator.v1PlatformIdDelete(id, options)),

        /**
         * get platform
         * @summary get platform
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdGet: (id: string, options?: any) => () => fetchData<PlatformDetailView>(fetchParamsCreator.v1PlatformIdGet(id, options)),

        /**
         * create platform webhook
         * @summary create platform webhook
         * @param {UpdatePlatformProjectRequest} body Request body
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectPost: (body: UpdatePlatformProjectRequest, id: string, options?: any) => () => fetchData<PlatformDetailView>(fetchParamsCreator.v1PlatformIdProjectPost(body, id, options)),

        /**
         * delete platform project
         * @summary delete platform project
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdDelete: (id: string, projectId: string, options?: any) => () => fetchData<PlatformDetailView>(fetchParamsCreator.v1PlatformIdProjectProjectIdDelete(id, projectId, options)),

        /**
         * update platform webhook
         * @summary update platform webhook
         * @param {UpdatePlatformWebhookRequest} body Request body
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdHookPut: (body: UpdatePlatformWebhookRequest, id: string, projectId: string, options?: any) => () => fetchData<PlatformDetailView>(fetchParamsCreator.v1PlatformIdProjectProjectIdHookPut(body, id, projectId, options)),

        /**
         * delete platform webhook
         * @summary delete platform webhook 
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {string} hook_name Platform Project Webhook Name
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdHookDelete: (id: string, projectId: string, hook_name: string, options?: any) => () => fetchData<PlatformDetailView>(fetchParamsCreator.v1PlatformIdProjectProjectIdHookDelete(id, projectId, hook_name, options)),

        /**
         * update platform project
         * @summary update platform project
         * @param {UpdatePlatformProjectRequest} body Request body
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdPut: (body: UpdatePlatformProjectRequest, id: string, projectId: string, options?: any) => () => fetchData<PlatformDetailView>(fetchParamsCreator.v1PlatformIdProjectProjectIdPut(body, id, projectId, options)),

        /**
         * update platform
         * @summary update platform
         * @param {UpdatePlatformRequest} body Request body
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdPut: (body: UpdatePlatformRequest, id: string, options?: any) => () => fetchData<PlatformDetailView>(fetchParamsCreator.v1PlatformIdPut(body, id, options)),

        /**
         * create platform
         * @summary create platform
         * @param {CreatePlatformRequest} body Request body
         * @param {*} [options] Override http request option.
         */
        v1PlatformPost: (body: CreatePlatformRequest, options?: any) => () => fetchData<PlatformDetailView>(fetchParamsCreator.v1PlatformPost(body, options)),

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
         * @param {UpdatePlatformProjectRequest} body Request body
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectPost(body: UpdatePlatformProjectRequest, id: string, options?: any) {
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
         * @param {UpdatePlatformWebhookRequest} body Request body
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdHookPut(body: UpdatePlatformWebhookRequest, id: string, projectId: string, options?: any) {
            return PlatformApiFp(configuration).v1PlatformIdProjectProjectIdHookPut(body, id, projectId, options)()
        },
        /**
         * delete platform webhook
         * @summary delete platform webhook
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {string} hook_name Platform Project Webhook Name
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdHookDelete(id: string, projectId: string, hook_name: string, options?: any) {
            return PlatformApiFp(configuration).v1PlatformIdProjectProjectIdHookDelete(id, projectId, hook_name, options)()
        },
        /**
         * update platform project
         * @summary update platform project
         * @param {UpdatePlatformProjectRequest} body Request body
         * @param {string} id Platform ID
         * @param {string} projectId Platform Project ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdPut(body: UpdatePlatformProjectRequest, id: string, projectId: string, options?: any) {
            return PlatformApiFp(configuration).v1PlatformIdProjectProjectIdPut(body, id, projectId, options)()
        },
        /**
         * update platform
         * @summary update platform
         * @param {UpdatePlatformRequest} body Request body
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdPut(body: UpdatePlatformRequest, id: string, options?: any) {
            return PlatformApiFp(configuration).v1PlatformIdPut(body, id, options)()
        },
        /**
         * create platform
         * @summary create platform
         * @param {CreatePlatformRequest} body Request body
         * @param {*} [options] Override http request option.
         */
        v1PlatformPost(body: CreatePlatformRequest, options?: any) {
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
     * @param {UpdatePlatformProjectRequest} body Request body
     * @param {string} id Platform ID
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformIdProjectPost(body: UpdatePlatformProjectRequest, id: string, options?: any) {
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
     * @param {UpdatePlatformWebhookRequest} body Request body
     * @param {string} id Platform ID
     * @param {string} projectId Platform Project ID
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformIdProjectProjectIdHookPut(body: UpdatePlatformWebhookRequest, id: string, projectId: string, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformIdProjectProjectIdHookPut(body, id, projectId, options)()
    }

    /**
     * delete platform webhook
     * @summary update platform webhook
     * @param {string} id Platform ID
     * @param {string} projectId Platform Project ID
     * @param {string} hook_name Platform Project Webhook Name
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformIdProjectProjectIdHookDelete(id: string, projectId: string, hook_name: string, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformIdProjectProjectIdHookDelete(id, projectId, hook_name, options)()
    }

    /**
     * update platform project
     * @summary update platform project
     * @param {UpdatePlatformProjectRequest} body Request body
     * @param {string} id Platform ID
     * @param {string} projectId Platform Project ID
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformIdProjectProjectIdPut(body: UpdatePlatformProjectRequest, id: string, projectId: string, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformIdProjectProjectIdPut(body, id, projectId, options)()
    }

    /**
     * update platform
     * @summary update platform
     * @param {UpdatePlatformRequest} body Request body
     * @param {string} id Platform ID
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformIdPut(body: UpdatePlatformRequest, id: string, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformIdPut(body, id, options)()
    }

    /**
     * create platform
     * @summary create platform
     * @param {CreatePlatformRequest} body Request body
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformPost(body: CreatePlatformRequest, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformPost(body, options)()
    }

}

export const fieldRequiredCheck = (value: any, fieldName: string) => {
    return !!value || (fieldName + ' field is required')
}

export const fieldMaxLengthCheck = (value: any, fieldName: string, length: number) => {
    return !!value && value.length <= length || (fieldName + ' field must be less than ' + length + ' characters')
}
export const fieldMinLengthCheck = (value: any, fieldName: string, length: number) => {
    return !!value && value.length >= length || (fieldName + ' field must be big than ' + length + ' characters')
}