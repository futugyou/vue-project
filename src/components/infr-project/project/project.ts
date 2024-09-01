import { BaseAPI, FetchAPI, FetchArgs, RequiredError, FetchParamCreator, fetchData } from "@/tools/fetch"

const BASE_PATH = import.meta.env.VUE_APP_INFR_PROJECT_SERVER.replace(/\/+$/, "")

/**
 * 
 * @export
 * @interface ProjectDesign
 */
export interface ProjectDesign {
    /**
     * 
     * @type {string}
     * @memberof ProjectDesign
     */
    description?: string
    /**
     * 
     * @type {string}
     * @memberof ProjectDesign
     */
    name?: string
    /**
     * 
     * @type {Array<string>}
     * @memberof ProjectDesign
     */
    resources?: Array<string>
}

/**
 * 
 * @export
 * @interface ProjectPlatform
 */
export interface ProjectPlatform {
    /**
     * 
     * @type {string}
     * @memberof ProjectPlatform
     */
    description?: string
    /**
     * 
     * @type {string}
     * @memberof ProjectPlatform
     */
    name?: string
    /**
     * 
     * @type {string}
     * @memberof ProjectPlatform
     */
    projectId?: string
}

/**
 * 
 * @export
 * @interface ProjectView
 */
export interface ProjectView {
    /**
     * 
     * @type {string}
     * @memberof ProjectView
     */
    description?: string
    /**
     * 
     * @type {Array<ProjectDesign>}
     * @memberof ProjectView
     */
    designs?: Array<ProjectDesign>
    /**
     * 
     * @type {string}
     * @memberof ProjectView
     */
    endDate?: string
    /**
     * 
     * @type {string}
     * @memberof ProjectView
     */
    id?: string
    /**
     * 
     * @type {string}
     * @memberof ProjectView
     */
    name?: string
    /**
     * 
     * @type {Array<ProjectPlatform>}
     * @memberof ProjectView
     */
    platforms?: Array<ProjectPlatform>
    /**
     * 
     * @type {string}
     * @memberof ProjectView
     */
    startDate?: string
    /**
     * 
     * @type {string}
     * @memberof ProjectView
     */
    state?: string
    /**
     * 
     * @type {Array<string>}
     * @memberof ProjectView
     */
    tags?: Array<string>
}

/**
 * 
 * @export
 * @interface UpdateProjectDesignRequest
 */
export interface UpdateProjectDesignRequest {
    /**
     * 
     * @type {string}
     * @memberof UpdateProjectDesignRequest
     */
    description?: string
    /**
     * 
     * @type {string}
     * @memberof UpdateProjectDesignRequest
     */
    name: string
    /**
     * 
     * @type {Array<string>}
     * @memberof UpdateProjectDesignRequest
     */
    resources: Array<string>
}

/**
 * 
 * @export
 * @interface UpdateProjectPlatformRequest
 */
export interface UpdateProjectPlatformRequest {
    /**
     * 
     * @type {string}
     * @memberof UpdateProjectPlatformRequest
     */
    description?: string
    /**
     * 
     * @type {string}
     * @memberof UpdateProjectPlatformRequest
     */
    name: string
    /**
     * 
     * @type {string}
     * @memberof UpdateProjectPlatformRequest
     */
    projectId: string
}

/**
 * 
 * @export
 * @interface UpdateProjectRequest
 */
export interface UpdateProjectRequest {
    /**
     * 
     * @type {string}
     * @memberof UpdateProjectRequest
     */
    description?: string
    /**
     * 
     * @type {string}
     * @memberof UpdateProjectRequest
     */
    endTime?: string
    /**
     * 
     * @type {string}
     * @memberof UpdateProjectRequest
     */
    name?: string
    /**
     * 
     * @type {string}
     * @memberof UpdateProjectRequest
     */
    startTime?: string
    /**
     * 
     * @type {string}
     * @memberof UpdateProjectRequest
     */
    state?: ProjectStateEnum
    /**
     * 
     * @type {Array<string>}
     * @memberof UpdateProjectRequest
     */
    tags?: Array<string>
}

/**
 * @export
 * @enum {string}
 */
export enum ProjectStateEnum {
    Preparing = <any>'preparing',
    Processing = <any>'processing',
    Finished = <any>'finished'
}

/**
 * 
 * @export
 * @interface CreateProjectRequest
 */
export interface CreateProjectRequest {
    /**
     * 
     * @type {string}
     * @memberof CreateProjectRequest
     */
    description: string
    /**
     * 
     * @type {string}
     * @memberof CreateProjectRequest
     */
    endTime?: string
    /**
     * 
     * @type {string}
     * @memberof CreateProjectRequest
     */
    name: string
    /**
     * 
     * @type {string}
     * @memberof CreateProjectRequest
     */
    startTime?: string
    /**
     * 
     * @type {string}
     * @memberof CreateProjectRequest
     */
    state?: ProjectStateEnum
    /**
     * 
     * @type {Array<string>}
     * @memberof CreateProjectRequest
     */
    tags?: Array<string>
}

/**
 * ProjectApi - fetch parameter creator
 * @export
 */
export const ProjectApiFetchParamCreator = (configuration?: any) => {
    return {
        /**
         * get all project
         * @summary get all project
         * @param {*} [options] Override http request option.
         */
        v1ProjectGet(options: any = {}): FetchArgs {
            const path = new URL(BASE_PATH + `/api/v1/project`)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'GET', undefined, options)
        },
        /**
         * update project design
         * @summary update project design
         * @param {Array<UpdateProjectDesignRequest>} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdDesignPut(body: Array<UpdateProjectDesignRequest>, id: string, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1ProjectIdDesignPut.')
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1ProjectIdDesignPut.')
            }
            const localVarPath = `/api/v1/project/{id}/design`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'PUT', body, options)
        },
        /**
         * get project
         * @summary get project
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdGet(id: string, options: any = {}): FetchArgs {
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1ProjectIdGet.')
            }
            const localVarPath = `/api/v1/project/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'GET', undefined, options)
        },
        /**
         * update project platform
         * @summary update project platform
         * @param {Array<UpdateProjectPlatformRequest>} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdPlatformPut(body: Array<UpdateProjectPlatformRequest>, id: string, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1ProjectIdPlatformPut.')
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1ProjectIdPlatformPut.')
            }
            const localVarPath = `/api/v1/project/{id}/platform`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'PUT', body, options)
        },
        /**
         * update project
         * @summary update project
         * @param {UpdateProjectRequest} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdPut(body: UpdateProjectRequest, id: string, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1ProjectIdPut.')
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1ProjectIdPut.')
            }
            const localVarPath = `/api/v1/project/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'PUT', body, options)
        },
        /**
         * create project
         * @summary create project
         * @param {CreateProjectRequest} body Request body
         * @param {*} [options] Override http request option.
         */
        v1ProjectPost(body: CreateProjectRequest, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1ProjectPost.')
            }
            const localVarPath = `/api/v1/project`
            const path = new URL(BASE_PATH + localVarPath)
            return FetchParamCreator(configuration).BuildFetchArgs(path, 'POST', body, options)
        },
    }
}

/**
 * ProjectApi - functional programming interface
 * @export
 */
export const ProjectApiFp = function (configuration?: any) {
    const fetchParamsCreator = ProjectApiFetchParamCreator(configuration)
    return {
        /**
         * get all project
         * @summary get all project
         * @param {*} [options] Override http request option.
         */
        v1ProjectGet: (options?: any) => () => fetchData<ProjectView[]>(fetchParamsCreator.v1ProjectGet(options)),

        /**
        * update project design
        * @summary update project design
        * @param {Array<UpdateProjectDesignRequest>} body Request body
        * @param {string} id Project ID
        * @param {*} [options] Override http request option.
        * @throws {RequiredError}
        */
        v1ProjectIdDesignPut: (body: Array<UpdateProjectDesignRequest>, id: string, options?: any) => () => fetchData<ProjectView>(fetchParamsCreator.v1ProjectIdDesignPut(body, id, options)),

        /**
        * get project
        * @summary get project
        * @param {string} id Project ID
        * @param {*} [options] Override http request option.
        * @throws {RequiredError}
        */
        v1ProjectIdGet: (id: string, options?: any) => () => fetchData<ProjectView>(fetchParamsCreator.v1ProjectIdGet(id, options)),

        /**
         * update project platform
         * @summary update project platform
         * @param {Array<UpdateProjectPlatformRequest>} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdPlatformPut: (body: Array<UpdateProjectPlatformRequest>, id: string, options?: any) => () => fetchData<ProjectView>(fetchParamsCreator.v1ProjectIdPlatformPut(body, id, options)),

        /**
         * update project
         * @summary update project
         * @param {UpdateProjectRequest} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdPut: (body: UpdateProjectRequest, id: string, options?: any) => () => fetchData<ProjectView>(fetchParamsCreator.v1ProjectIdPut(body, id, options)),

        /**
         * create project
         * @summary create project
         * @param {CreateProjectRequest} body Request body
         * @param {*} [options] Override http request option.
         */
        v1ProjectPost: (body: CreateProjectRequest, options?: any) => () => fetchData<ProjectView>(fetchParamsCreator.v1ProjectPost(body, options)),

    }
}

/**
 * ProjectApi - factory interface
 * @export
 */
export const ProjectApiFactory = function (configuration?: any, fetch?: FetchAPI, basePath?: string) {
    return {
        /**
         * get all project
         * @summary get all project
         * @param {*} [options] Override http request option.
         */
        v1ProjectGet(options?: any) {
            return ProjectApiFp(configuration).v1ProjectGet(options)()
        },
        /**
         * update project design
         * @summary update project design
         * @param {Array<UpdateProjectDesignRequest>} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdDesignPut(body: Array<UpdateProjectDesignRequest>, id: string, options?: any) {
            return ProjectApiFp(configuration).v1ProjectIdDesignPut(body, id, options)()
        },
        /**
         * get project
         * @summary get project
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdGet(id: string, options?: any) {
            return ProjectApiFp(configuration).v1ProjectIdGet(id, options)()
        },
        /**
         * update project platform
         * @summary update project platform
         * @param {Array<UpdateProjectPlatformRequest>} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdPlatformPut(body: Array<UpdateProjectPlatformRequest>, id: string, options?: any) {
            return ProjectApiFp(configuration).v1ProjectIdPlatformPut(body, id, options)()
        },
        /**
         * update project
         * @summary update project
         * @param {UpdateProjectRequest} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdPut(body: UpdateProjectRequest, id: string, options?: any) {
            return ProjectApiFp(configuration).v1ProjectIdPut(body, id, options)()
        },
        /**
         * create project
         * @summary create project
         * @param {CreateProjectRequest} body Request body
         * @param {*} [options] Override http request option.
         */
        v1ProjectPost(body: CreateProjectRequest, options?: any) {
            return ProjectApiFp(configuration).v1ProjectPost(body, options)()
        },
    }
}

/**
 * ProjectApi - object-oriented interface
 * @export
 * @class ProjectApi
 * @extends {BaseAPI}
 */
export class ProjectApi extends BaseAPI {
    /**
     * get all project
     * @summary get all project
     * @param {*} [options] Override http request option.
     * @memberof ProjectApi
     */
    public v1ProjectGet(options?: any) {
        return ProjectApiFp(this.configuration).v1ProjectGet(options)()
    }

    /**
     * update project design
     * @summary update project design
     * @param {Array<UpdateProjectDesignRequest>} body Request body
     * @param {string} id Project ID
     * @param {*} [options] Override http request option.
     * @memberof ProjectApi
     */
    public v1ProjectIdDesignPut(body: Array<UpdateProjectDesignRequest>, id: string, options?: any) {
        return ProjectApiFp(this.configuration).v1ProjectIdDesignPut(body, id, options)()
    }

    /**
     * get project
     * @summary get project
     * @param {string} id Project ID
     * @param {*} [options] Override http request option.
     * @memberof ProjectApi
     */
    public v1ProjectIdGet(id: string, options?: any) {
        return ProjectApiFp(this.configuration).v1ProjectIdGet(id, options)()
    }

    /**
     * update project platform
     * @summary update project platform
     * @param {Array<UpdateProjectPlatformRequest>} body Request body
     * @param {string} id Project ID
     * @param {*} [options] Override http request option.
     * @memberof ProjectApi
     */
    public v1ProjectIdPlatformPut(body: Array<UpdateProjectPlatformRequest>, id: string, options?: any) {
        return ProjectApiFp(this.configuration).v1ProjectIdPlatformPut(body, id, options)()
    }

    /**
     * update project
     * @summary update project
     * @param {UpdateProjectRequest} body Request body
     * @param {string} id Project ID
     * @param {*} [options] Override http request option.
     * @memberof ProjectApi
     */
    public v1ProjectIdPut(body: UpdateProjectRequest, id: string, options?: any) {
        return ProjectApiFp(this.configuration).v1ProjectIdPut(body, id, options)()
    }

    /**
     * create project
     * @summary create project
     * @param {CreateProjectRequest} body Request body
     * @param {*} [options] Override http request option.
     * @memberof ProjectApi
     */
    public v1ProjectPost(body: CreateProjectRequest, options?: any) {
        return ProjectApiFp(this.configuration).v1ProjectPost(body, options)()
    }

}
