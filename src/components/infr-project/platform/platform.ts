import { BaseAPI, FetchAPI, FetchArgs, RequiredError, FetchParamCreator, fetchData } from "@/tools/fetch"

const BASE_PATH = import.meta.env.VUE_APP_INFR_PROJECT_SERVER.replace(/\/+$/, "")

export enum OperateEnum {
    Upsert = <any>'upsert',
    Sync = <any>'sync'
}

export const checkPlatfromPropertySecret = (provider: ProviderEnum, properties: Array<Property>, secrets: Array<Secret>): string => {
    switch (provider) {
        case ProviderEnum.Circleci:
            if (secrets.findIndex(p => p.key == "CIRCLECI_TOKEN") == -1) {
                return "Circleci Provider NEED CIRCLECI_TOKEN In Secret"
            }
            if (properties.findIndex(p => p.key == "org_slug") == -1) {
                return "Circleci Provider NEED org_slug In Property"
            }
            break;
        case ProviderEnum.Vercel:
            if (secrets.findIndex(p => p.key == "VERCEL_TOKEN") == -1) {
                return "Vercel Provider NEED VERCEL_TOKEN In Secret"
            }
            break;
        case ProviderEnum.Github:
            if (secrets.findIndex(p => p.key == "GITHUB_TOKEN") == -1) {
                return "Github Provider NEED GITHUB_TOKEN In Secret"
            }
            if (properties.findIndex(p => p.key == "GITHUB_OWNER") == -1) {
                return "Github Provider NEED GITHUB_OWNER In Property"
            }
            break;
    }

    return ""
}

export const checkPlatfromProjectProperty = (provider: ProviderEnum, properties: Array<Property>): string => {
    switch (provider) {
        case ProviderEnum.Circleci:
            break;
        case ProviderEnum.Vercel:
            break;
        case ProviderEnum.Github:
            if (properties.findIndex(p => p.key == "GITHUB_REPO") == -1) {
                return "Github Provider NEED GITHUB_REPO In Property"
            }
            break;
    }

    return ""
}

/**
 * 
 * @export
 * @interface Property
 */
export interface Property {
    /**
     * 
     * @type {string}
     * @memberof Property
     */
    key: string;
    /**
     * 
     * @type {string}
     * @memberof Property
     */
    value: string;
}

/**
 * 
 * @export
 * @interface Secret
 */
export interface Secret {
    /**
     * vault aliases
     * @type {string}
     * @memberof Secret
     */
    key: string;
    /**
     * vault id
     * @type {string}
     * @memberof Secret
     */
    vault_id: string;
    /**
     * vault key
     * @type {string}
     * @memberof Secret
     */
    vault_key?: string;
    /**
     * vault value mask
     * @type {string}
     * @memberof Secret
     */
    mask_value?: string;
}

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
    name: string;
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformProjectRequest
     */
    operate: OperateEnum;
    /**
     * 
     * @type {Array<Property>}
     * @memberof UpdatePlatformProjectRequest
     */
    properties: Array<Property>;
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformProjectRequest
     */
    provider_project_id: string;
    /**
     * only Key and VaultId in request
     * @type {Array<Secret>}
     * @memberof UpdatePlatformProjectRequest
     */
    secrets: Array<Secret>;
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformProjectRequest
     */
    url: string;
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformProjectRequest
     */
    description: string;          
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
    activate: boolean;
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformWebhookRequest
     */
    name: string;
    /**
     * 
     * @type {Array<Property>}
     * @memberof UpdatePlatformWebhookRequest
     */
    properties: Array<Property>;
    /**
     * only Key and VaultId in request
     * @type {Array<Secret>}
     * @memberof UpdatePlatformWebhookRequest
     */
    secrets: Array<Secret>;
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformWebhookRequest
     */
    state: WebhookStateEnum;
    /**
     * 
     * @type {boolean}
     * @memberof UpdatePlatformWebhookRequest
     */
    sync: boolean;
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformWebhookRequest
     */
    url: string;
}

export enum ProviderEnum {
    Vercel = <any>'vercel',
    Github = <any>'github',
    Circleci = <any>'circleci',
    Other = <any>'other'
}

/**
 * 
 * @export
 * @interface UpdatePlatformRequest
 */
export interface UpdatePlatformRequest {
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformRequest
     */
    name: string;
    /**
     * 
     * @type {Array<Property>}
     * @memberof UpdatePlatformRequest
     */
    properties: Array<Property>;
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformRequest
     */
    provider: ProviderEnum;
    /**
     * only Key and VaultId in request
     * @type {Array<Secret>}
     * @memberof UpdatePlatformRequest
     */
    secrets: Array<Secret>;
    /**
     * 
     * @type {Array<string>}
     * @memberof UpdatePlatformRequest
     */
    tags: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof UpdatePlatformRequest
     */
    url: string;
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
    activate: boolean;
    /**
     * 
     * @type {string}
     * @memberof PlatformView
     */
    id: string;
    /**
     * 
     * @type {boolean}
     * @memberof PlatformView
     */
    is_deleted: boolean;
    /**
     * 
     * @type {string}
     * @memberof PlatformView
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof PlatformView
     */
    provider: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof PlatformView
     */
    tags: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof PlatformView
     */
    url: string;
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
    activate: boolean;
    /**
     * 
     * @type {string}
     * @memberof PlatformDetailView
     */
    id: string;
    /**
     * 
     * @type {boolean}
     * @memberof PlatformDetailView
     */
    is_deleted: boolean;
    /**
     * 
     * @type {string}
     * @memberof PlatformDetailView
     */
    name: string;
    /**
     * 
     * @type {Array<PlatformProject>}
     * @memberof PlatformDetailView
     */
    projects: Array<PlatformProject>;
    /**
     * 
     * @type {Array<Property>}
     * @memberof PlatformDetailView
     */
    properties: Array<Property>;
    /**
     * 
     * @type {string}
     * @memberof PlatformDetailView
     */
    provider: string;
    /**
     * 
     * @type {Array<Secret>}
     * @memberof PlatformDetailView
     */
    secrets: Array<Secret>;
    /**
     * 
     * @type {Array<string>}
     * @memberof PlatformDetailView
     */
    tags: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof PlatformDetailView
     */
    url: string;
}

/**
 * 
 * @export
 * @interface PlatformProject
 */
export interface PlatformProject {
    /**
     * 
     * @type {boolean}
     * @memberof PlatformProject
     */
    followed: boolean;
    /**
     * 
     * @type {string}
     * @memberof PlatformProject
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof PlatformProject
     */
    name: string;
    /**
     * 
     * @type {Array<Property>}
     * @memberof PlatformProject
     */
    properties: Array<Property>;
    /**
     * 
     * @type {string}
     * @memberof PlatformProject
     */
    provider_project_id: string;
    /**
     * 
     * @type {Array<Secret>}
     * @memberof PlatformProject
     */
    secrets: Array<Secret>;
    /**
     * 
     * @type {string}
     * @memberof PlatformProject
     */
    url: string;
    /**
     * 
     * @type {Array<Webhook>}
     * @memberof PlatformProject
     */
    webhooks: Array<Webhook>;
    /**
     * 
     * @type {string}
     * @memberof PlatformProject
     */
    description: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof PlatformProject
     */
    environments: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof PlatformProject
     */
    badge_url: string;
    /**
     * 
     * @type {string}
     * @memberof PlatformProject
     */
    badge_markdown: string;
    /**
     * 
     * @type {Array<EnvironmentVariable>}
     * @memberof PlatformProject
     */
    environment_variables: Array<EnvironmentVariable>;
    /**
     * 
     * @type {Array<Workflow>}
     * @memberof PlatformProject
     */
    workflows: Array<Workflow>;
    /**
     * 
     * @type {Array<WorkflowRun>}
     * @memberof PlatformProject
     */
    workflow_runs: Array<WorkflowRun>;
    /**
     * 
     * @type {Array<Deployment>}
     * @memberof PlatformProject
     */
    deployments: Array<Deployment>;
}

/**
 * 
 * @export
 * @interface Deployment
 */
export interface Deployment {
    /**
     * 
     * @type {string}
     * @memberof Deployment
     */
    id: string
    /**
     * 
     * @type {string}
     * @memberof Deployment
     */
    name: string
    /**
     * 
     * @type {string}
     * @memberof Deployment
     */
    createdAt: string
    /**
     * 
     * @type {string}
     * @memberof Deployment
     */
    environment: string
    /**
     * 
     * @type {string}
     * @memberof Deployment
     */
    readyState: string
    /**
     * 
     * @type {string}
     * @memberof Deployment
     */
    readySubstate: string
    /**
     * 
     * @type {string}
     * @memberof Deployment
     */
    badge_url: string
    /**
     * 
     * @type {string}
     * @memberof Deployment
     */
    badge_markdown: string
}

/**
 * 
 * @export
 * @interface WorkflowRun
 */
export interface WorkflowRun {
    /**
     * 
     * @type {string}
     * @memberof WorkflowRun
     */
    id: string
    /**
     * 
     * @type {string}
     * @memberof WorkflowRun
     */
    name: string
    /**
     * 
     * @type {string}
     * @memberof WorkflowRun
     */
    createdAt: string
    /**
     * 
     * @type {string}
     * @memberof WorkflowRun
     */
    status: string
    /**
     * 
     * @type {string}
     * @memberof WorkflowRun
     */
    badge_url: string
    /**
     * 
     * @type {string}
     * @memberof WorkflowRun
     */
    badge_markdown: string
}

/**
 * 
 * @export
 * @interface Workflow
 */
export interface Workflow {
    /**
     * 
     * @type {string}
     * @memberof Workflow
     */
    id: string
    /**
     * 
     * @type {string}
     * @memberof Workflow
     */
    name: string
    /**
     * 
     * @type {string}
     * @memberof Workflow
     */
    createdAt: string
    /**
     * 
     * @type {string}
     * @memberof Workflow
     */
    status: string
    /**
     * 
     * @type {string}
     * @memberof Workflow
     */
    badge_url: string
    /**
     * 
     * @type {string}
     * @memberof Workflow
     */
    badge_markdown: string
}

/**
 * 
 * @export
 * @interface EnvironmentVariable
 */
export interface EnvironmentVariable {
    /**
     * 
     * @type {string}
     * @memberof EnvironmentVariable
     */
    id: string
    /**
     * 
     * @type {string}
     * @memberof EnvironmentVariable
     */
    key: string
    /**
     * 
     * @type {string}
     * @memberof EnvironmentVariable
     */
    createdAt: string
    /**
     * 
     * @type {string}
     * @memberof EnvironmentVariable
     */
    updatedAt: string
    /**
     * 
     * @type {string}
     * @memberof EnvironmentVariable
     */
    type: string
    /**
     * 
     * @type {string}
     * @memberof EnvironmentVariable
     */
    value: string
}

export const DefaultWebhook: Webhook = {
    name: "", url: "", properties: [], activate: true, state: 'Init', secrets: [],
    id: "",
    events: [],
    followed: false
}

export const DefaultPlatformProject: PlatformProject = {
    id: "",
    name: "", url: "", followed: false, properties: [], provider_project_id: "", secrets: [], webhooks: [],
    description: "", environments: [], badge_url: "", badge_markdown: "",
    environment_variables: [], workflows: [], workflow_runs: [], deployments: []
}

/**
 * 
 * @export
 * @interface Webhook
 */
export interface Webhook {
    /**
     * 
     * @type {string}
     * @memberof Webhook
     */
    id: string
    /**
     * 
     * @type {string}
     * @memberof Webhook
     */
    name: string
    /**
     * 
     * @type {string}
     * @memberof Webhook
     */
    url: string
    /**
     * 
     * @type {Array<string>}
     * @memberof Webhook
     */
    events: Array<string>;
    /**
     * 
     * @type {boolean}
     * @memberof Webhook
     */
    activate: boolean
    /**
     * 
     * @type {string}
     * @memberof Webhook
     */
    state: string
    /**
     * 
     * @type {Array<Property>}
     * @memberof Webhook
     */
    properties: Array<Property>;
    /**
     * 
     * @type {Array<Secret>}
     * @memberof Webhook
     */
    secrets: Array<Secret>;
    /**
     * 
     * @type {boolean}
     * @memberof Webhook
     */
    followed: boolean
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
    name: string;
    /**
     * 
     * @type {Array<Property>}
     * @memberof CreatePlatformRequest
     */
    properties: Array<Property>;
    /**
     * 
     * @type {string}
     * @memberof CreatePlatformRequest
     */
    provider: ProviderEnum;
    /**
     * only Key and VaultId in request
     * @type {Array<Secret>}
     * @memberof CreatePlatformRequest
     */
    secrets: Array<Secret>;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreatePlatformRequest
     */
    tags: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof CreatePlatformRequest
     */
    url: string;
}

/**
 * 
 * @export
 * @interface RemoveWebhookRequest
 */
export interface RemoveWebhookRequest {
    /**
     * 
     * @type {boolean}
     * @memberof RemoveWebhookRequest
     */
    sync: boolean;
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
         * @param {boolean} sync Sync delete operate to provider
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdHookDelete(id: string, projectId: string, hook_name: string, sync: boolean, options: any = {}): FetchArgs {
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
            const request: RemoveWebhookRequest = {
                sync: sync
            }
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'Delete', request, options)
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
        /**
         * recovery platform
         * @summary recovery platform
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1PlatformIdRecoveryPost(id: string, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1PlatformIdRecoveryPost.');
            }
            const localVarPath = `/api/v1/platform/{id}/recovery`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'POST', undefined, options)
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
         * @param {boolean} sync Sync delete operate to provider
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdHookDelete: (id: string, projectId: string, hook_name: string, sync: boolean, options?: any) => () => fetchData<PlatformDetailView>(fetchParamsCreator.v1PlatformIdProjectProjectIdHookDelete(id, projectId, hook_name, sync, options)),

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

        /**
         * recovery platform
         * @summary recovery platform
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        v1PlatformIdRecoveryPost: (id: string, options?: any) => () => fetchData<PlatformDetailView>(fetchParamsCreator.v1PlatformIdRecoveryPost(id, options)),
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
         * @param {boolean} sync Sync delete operate to provider
         * @param {*} [options] Override http request option.
         */
        v1PlatformIdProjectProjectIdHookDelete(id: string, projectId: string, hook_name: string, sync: boolean = false, options?: any) {
            return PlatformApiFp(configuration).v1PlatformIdProjectProjectIdHookDelete(id, projectId, hook_name, sync, options)()
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
        /**
         * recovery platform
         * @summary recovery platform
         * @param {string} id Platform ID
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         * @memberof PlatformApi
         */
        v1PlatformIdRecoveryPost(id: string, options?: any) {
            return PlatformApiFp(configuration).v1PlatformIdRecoveryPost(id, options)()
        }
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
         * @param {boolean} sync Sync delete operate to provider
     * @param {*} [options] Override http request option.
     * @memberof PlatformApi
     */
    public v1PlatformIdProjectProjectIdHookDelete(id: string, projectId: string, hook_name: string, sync: boolean, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformIdProjectProjectIdHookDelete(id, projectId, hook_name, sync, options)()
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

    /**
     * recovery platform
     * @summary recovery platform
     * @param {string} id Platform ID
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PlatformApi
     */
    public v1PlatformIdRecoveryPost(id: string, options?: any) {
        return PlatformApiFp(this.configuration).v1PlatformIdRecoveryPost(id, options)()
    }
}
