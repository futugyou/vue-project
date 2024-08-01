import { BaseAPI, FetchAPI, FetchArgs, RequiredError, FetchParamCreator, fetchData } from "@/tools/fetch"

const BASE_PATH = import.meta.env.REACT_APP_INFR_PROJECT_SERVER.replace(/\/+$/, "")

/**
 * 
 * @export
 * @interface ViewmodelsProjectDesign
 */
export interface ViewmodelsProjectDesign {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsProjectDesign
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsProjectDesign
     */
    name?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof ViewmodelsProjectDesign
     */
    resources?: Array<string>;
}

/**
 * 
 * @export
 * @interface ViewmodelsProjectPlatform
 */
export interface ViewmodelsProjectPlatform {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsProjectPlatform
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsProjectPlatform
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsProjectPlatform
     */
    projectId?: string;
}

/**
 * 
 * @export
 * @interface ViewmodelsProjectView
 */
export interface ViewmodelsProjectView {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsProjectView
     */
    description?: string;
    /**
     * 
     * @type {Array<ViewmodelsProjectDesign>}
     * @memberof ViewmodelsProjectView
     */
    designs?: Array<ViewmodelsProjectDesign>;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsProjectView
     */
    endDate?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsProjectView
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsProjectView
     */
    name?: string;
    /**
     * 
     * @type {Array<ViewmodelsProjectPlatform>}
     * @memberof ViewmodelsProjectView
     */
    platforms?: Array<ViewmodelsProjectPlatform>;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsProjectView
     */
    startDate?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsProjectView
     */
    state?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof ViewmodelsProjectView
     */
    tags?: Array<string>;
}

/**
 * 
 * @export
 * @interface ViewmodelsUpdateProjectDesignRequest
 */
export interface ViewmodelsUpdateProjectDesignRequest {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdateProjectDesignRequest
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdateProjectDesignRequest
     */
    name: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof ViewmodelsUpdateProjectDesignRequest
     */
    resources: Array<string>;
}

/**
 * 
 * @export
 * @interface ViewmodelsUpdateProjectPlatformRequest
 */
export interface ViewmodelsUpdateProjectPlatformRequest {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdateProjectPlatformRequest
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdateProjectPlatformRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdateProjectPlatformRequest
     */
    projectId: string;
}

/**
 * 
 * @export
 * @interface ViewmodelsUpdateProjectRequest
 */
export interface ViewmodelsUpdateProjectRequest {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdateProjectRequest
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdateProjectRequest
     */
    endTime?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdateProjectRequest
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdateProjectRequest
     */
    startTime?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsUpdateProjectRequest
     */
    state?: ProjectStateEnum;
    /**
     * 
     * @type {Array<string>}
     * @memberof ViewmodelsUpdateProjectRequest
     */
    tags?: Array<string>;
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
 * @interface ViewmodelsCreateProjectRequest
 */
export interface ViewmodelsCreateProjectRequest {
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsCreateProjectRequest
     */
    description: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsCreateProjectRequest
     */
    endTime?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsCreateProjectRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsCreateProjectRequest
     */
    startTime?: string;
    /**
     * 
     * @type {string}
     * @memberof ViewmodelsCreateProjectRequest
     */
    state?: ProjectStateEnum;
    /**
     * 
     * @type {Array<string>}
     * @memberof ViewmodelsCreateProjectRequest
     */
    tags?: Array<string>;
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
            return FetchParamCreator(configuration).BuildFetchArgs(`/v1/project`, 'GET', undefined, options)
        },
        /**
         * update project design
         * @summary update project design
         * @param {Array<ViewmodelsUpdateProjectDesignRequest>} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdDesignPut(body: Array<ViewmodelsUpdateProjectDesignRequest>, id: string, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1ProjectIdDesignPut.')
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1ProjectIdDesignPut.')
            }
            const localVarPath = `/v1/project/{id}/design`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
            return FetchParamCreator(configuration).BuildFetchArgs(localVarPath, 'PUT', body, options)
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
            const localVarPath = `/v1/project/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
            return FetchParamCreator(configuration).BuildFetchArgs(localVarPath, 'GET', undefined, options)
        },
        /**
         * update project platform
         * @summary update project platform
         * @param {Array<ViewmodelsUpdateProjectPlatformRequest>} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdPlatformPut(body: Array<ViewmodelsUpdateProjectPlatformRequest>, id: string, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1ProjectIdPlatformPut.')
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1ProjectIdPlatformPut.')
            }
            const localVarPath = `/v1/project/{id}/platform`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
            return FetchParamCreator(configuration).BuildFetchArgs(localVarPath, 'PUT', body, options)
        },
        /**
         * update project
         * @summary update project
         * @param {ViewmodelsUpdateProjectRequest} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdPut(body: ViewmodelsUpdateProjectRequest, id: string, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1ProjectIdPut.')
            }
            // verify required parameter 'id' is not null or undefined
            if (id === null || id === undefined) {
                throw new RequiredError('id', 'Required parameter id was null or undefined when calling v1ProjectIdPut.')
            }
            const localVarPath = `/v1/project/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)))
            return FetchParamCreator(configuration).BuildFetchArgs(localVarPath, 'PUT', body, options)
        },
        /**
         * create project
         * @summary create project
         * @param {ViewmodelsCreateProjectRequest} body Request body
         * @param {*} [options] Override http request option.
         */
        v1ProjectPost(body: ViewmodelsCreateProjectRequest, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling v1ProjectPost.')
            }
            const localVarPath = `/v1/project`
            return FetchParamCreator(configuration).BuildFetchArgs(localVarPath, 'POST', body, options)
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
        v1ProjectGet: (options?: any) => () => fetchData<ViewmodelsProjectView[]>(BASE_PATH, fetchParamsCreator.v1ProjectGet(options)),

        /**
        * update project design
        * @summary update project design
        * @param {Array<ViewmodelsUpdateProjectDesignRequest>} body Request body
        * @param {string} id Project ID
        * @param {*} [options] Override http request option.
        * @throws {RequiredError}
        */
        v1ProjectIdDesignPut: (body: Array<ViewmodelsUpdateProjectDesignRequest>, id: string, options?: any) => () => fetchData<ViewmodelsProjectView>(BASE_PATH, fetchParamsCreator.v1ProjectIdDesignPut(body, id, options)),

        /**
        * get project
        * @summary get project
        * @param {string} id Project ID
        * @param {*} [options] Override http request option.
        * @throws {RequiredError}
        */
        v1ProjectIdGet: (id: string, options?: any) => () => fetchData<ViewmodelsProjectView>(BASE_PATH, fetchParamsCreator.v1ProjectIdGet(id, options)),
        
        /**
         * update project platform
         * @summary update project platform
         * @param {Array<ViewmodelsUpdateProjectPlatformRequest>} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdPlatformPut: (body: Array<ViewmodelsUpdateProjectPlatformRequest>, id: string, options?: any) => () => fetchData<ViewmodelsProjectView>(BASE_PATH, fetchParamsCreator.v1ProjectIdPlatformPut(body, id, options)),

        /**
         * update project
         * @summary update project
         * @param {ViewmodelsUpdateProjectRequest} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdPut: (body: ViewmodelsUpdateProjectRequest, id: string, options?: any) => () => fetchData<ViewmodelsProjectView>(BASE_PATH, fetchParamsCreator.v1ProjectIdPut(body, id, options)),

        /**
         * create project
         * @summary create project
         * @param {ViewmodelsCreateProjectRequest} body Request body
         * @param {*} [options] Override http request option.
         */
        v1ProjectPost: (body: ViewmodelsCreateProjectRequest, options?: any) => () => fetchData<ViewmodelsProjectView>(BASE_PATH, fetchParamsCreator.v1ProjectPost(body, options)),

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
         * @param {Array<ViewmodelsUpdateProjectDesignRequest>} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdDesignPut(body: Array<ViewmodelsUpdateProjectDesignRequest>, id: string, options?: any) {
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
         * @param {Array<ViewmodelsUpdateProjectPlatformRequest>} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdPlatformPut(body: Array<ViewmodelsUpdateProjectPlatformRequest>, id: string, options?: any) {
            return ProjectApiFp(configuration).v1ProjectIdPlatformPut(body, id, options)()
        },
        /**
         * update project
         * @summary update project
         * @param {ViewmodelsUpdateProjectRequest} body Request body
         * @param {string} id Project ID
         * @param {*} [options] Override http request option.
         */
        v1ProjectIdPut(body: ViewmodelsUpdateProjectRequest, id: string, options?: any) {
            return ProjectApiFp(configuration).v1ProjectIdPut(body, id, options)()
        },
        /**
         * create project
         * @summary create project
         * @param {ViewmodelsCreateProjectRequest} body Request body
         * @param {*} [options] Override http request option.
         */
        v1ProjectPost(body: ViewmodelsCreateProjectRequest, options?: any) {
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
     * @param {Array<ViewmodelsUpdateProjectDesignRequest>} body Request body
     * @param {string} id Project ID
     * @param {*} [options] Override http request option.
     * @memberof ProjectApi
     */
    public v1ProjectIdDesignPut(body: Array<ViewmodelsUpdateProjectDesignRequest>, id: string, options?: any) {
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
     * @param {Array<ViewmodelsUpdateProjectPlatformRequest>} body Request body
     * @param {string} id Project ID
     * @param {*} [options] Override http request option.
     * @memberof ProjectApi
     */
    public v1ProjectIdPlatformPut(body: Array<ViewmodelsUpdateProjectPlatformRequest>, id: string, options?: any) {
        return ProjectApiFp(this.configuration).v1ProjectIdPlatformPut(body, id, options)()
    }

    /**
     * update project
     * @summary update project
     * @param {ViewmodelsUpdateProjectRequest} body Request body
     * @param {string} id Project ID
     * @param {*} [options] Override http request option.
     * @memberof ProjectApi
     */
    public v1ProjectIdPut(body: ViewmodelsUpdateProjectRequest, id: string, options?: any) {
        return ProjectApiFp(this.configuration).v1ProjectIdPut(body, id, options)()
    }

    /**
     * create project
     * @summary create project
     * @param {ViewmodelsCreateProjectRequest} body Request body
     * @param {*} [options] Override http request option.
     * @memberof ProjectApi
     */
    public v1ProjectPost(body: ViewmodelsCreateProjectRequest, options?: any) {
        return ProjectApiFp(this.configuration).v1ProjectPost(body, options)()
    }

}
