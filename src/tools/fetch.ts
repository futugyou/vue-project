import { getToken, logout } from "./token"
import { defaultAccountId } from "./accountid"
import { forEach } from "lodash-es"

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
    const authorization = getToken()

    if (needAuth && authorization == "") {
        return { data, error: new Error('user not login or do not have right') }
    }

    let h: Record<string, string> = {
        'Content-Type': 'application/json',
        'Account-Id': defaultAccountId(),
        'Authorization': getToken()
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
            logout()
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
