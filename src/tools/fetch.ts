import { getToken, logout } from "./token"
import { defaultAccountId } from "./accountid"

export const fetchEx = async (
    url: string,
    mothed?: 'get' | 'post' | 'put' | 'delete',
    entity?: any
) => {
    mothed = mothed ?? 'get'
    let error: any = null
    let data: any = null
    let headers = {
        'Content-Type': 'application/json',
        'Account-Id': defaultAccountId(),
        'Authorization': getToken()
    }

    try {
        let res: Response
        if (entity) {
            res = await fetch(url, {
                method: mothed,
                headers: headers,
                body: JSON.stringify(entity)
            })
        } else {
            res = await fetch(url, {
                method: mothed,
                headers: headers
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
