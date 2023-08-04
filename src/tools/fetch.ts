import { getToken } from "./token"

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
        'Account-Id': '', // TODO: 
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
                method: mothed
            })
        }

        if (res.status == 401) {
            throw new Error('user not login or do not have right')
        }
        if (res.status == 404) {
            throw new Error('no data found')
        }
        if (!res.ok) {
            throw new Error(res.statusText)
        }

        data = await res.json()
    } catch (e: any) {
        error = e
    }

    return { data, error }
}
