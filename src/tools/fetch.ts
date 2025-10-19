
import { forEach } from "lodash-es"

import { getToken, logout } from "./auth"
import { defaultAccountId } from "./accountid"

export const isomorphicFetch = fetch

export const fetchEx = async (
    url: string,
    mothed?: 'get' | 'post' | 'put' | 'delete',
    entity?: any,
    needAuth?: boolean,
    headers?: Record<string, string>,
) => {
    mothed = mothed ?? 'get'
    let error: any = null
    let data: any = null
    const authorization = getToken() ?? ""

    if (needAuth && authorization == "") {
        return { data, error: new Error('user not login or do not have right') }
    }

    let h: Record<string, string> = {
        'Content-Type': 'application/json',
        'Account-Id': defaultAccountId(),
        'Authorization': authorization
    }

    if (!needAuth) {
        delete h['Authorization']
    }

    if (headers) {
        forEach(headers, (value, key) => {
            h[key] = value
        })
    }
    try {
        let res: Response
        if (entity) {
            res = await fetch(url, {
                method: mothed,
                headers: h,
                body: JSON.stringify(entity)
            })
        } else {
            res = await fetch(url, {
                method: mothed,
                headers: h
            })
        }

        if (res.status == 401) {
            await logout()
            throw new Error('user not login or do not have right')
        }
        if (res.status == 404) {
            throw new Error('no data found')
        }
        if (!res.ok) {
            let text = await res.text()
            throw new Error(text)
        }

        data = await res.json()
    } catch (e: any) {
        error = e
    }

    return { data, error }
}

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
        super(msg)
    }
}

/**
 *
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
    protected configuration: any

    constructor(protected basePath: string, protected fetch: FetchAPI = isomorphicFetch, configuration?: any) {
        if (configuration) {
            this.configuration = configuration
            this.basePath = configuration.basePath || this.basePath
        }
    }
}

/**
 * fetch parameter creator
 * @export
 */
export const FetchParamCreator = (configuration?: any) => {
    return {
        /**
         * get all resources
         * @summary get all resources
         * @param {*} [options] Override http request option.
         */
        BuildFetchArgs(path: URL, method: string, body: any, options: any = {}): FetchArgs {
            const localVarRequestOptions = Object.assign({ method: method }, options)
            const localVarHeaderParameter = {} as any
            const localVarQueryParameter = {} as any
            localVarHeaderParameter['Content-Type'] = 'application/json'

            if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
                localVarHeaderParameter['Authorization'] = getToken()
            }

            const params = new URLSearchParams(path.search)
            Object.entries(Object.assign({}, localVarQueryParameter, options.query)).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.set(key, (value as any).toString())
                }
            })
            path.search = params.toString()

            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers)

            if (body !== null && body !== undefined) {
                localVarRequestOptions.body = JSON.stringify(body || {})
            }

            return {
                url: path.toString(),
                options: localVarRequestOptions,
            }
        }
    }
}

export const fetchData = async <T>(localVarFetchArgs: FetchArgs, fetch: FetchAPI = isomorphicFetch): Promise<{ data?: T, error?: any }> => {
    const actualFetch = fetch || isomorphicFetch
    try {
        const response = await actualFetch(localVarFetchArgs.url, localVarFetchArgs.options)
        if (response.status >= 200 && response.status < 300) {
            const data = await response.json()
            return { data }
        } else {
            const text = await response.text()
            let error
            try {
                error = JSON.parse(text)
            } catch (e) {
                error = text
            }

            if (error.message) {
                return { error }
            }

            error = { message: error }
            return { error }
        }
    } catch (error) {
        return { error }
    }
}