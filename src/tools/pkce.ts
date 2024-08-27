import { b64toB64UrlEncoded, shaString } from './util'

export type PKCECodePair = {
    codeVerifier: string
    codeChallenge: string
    createdAt: Date
}

export class pkce {
    constructor() {
    }

    async create(): Promise<PKCECodePair> {
        const codeVerifier = generateCodeVerifier()
        const codeChallenge = await createCodeChallenge(codeVerifier)
        const createdAt = new Date()
        const codePair = {
            codeVerifier,
            codeChallenge,
            createdAt
        }
        return codePair
    }

}

const generateCodeVerifier = () => {
    return b64toB64UrlEncoded(
        Math.floor(Math.random() * Date.now()).toString(36)
        + Math.floor(Math.random() * Date.now()).toString(36)
        + Math.floor(Math.random() * Date.now()).toString(36)
    )
}

const createCodeChallenge = async (codeVerifier: string): Promise<string> => {
    var shacode = await shaString(codeVerifier)
    return b64toB64UrlEncoded(shacode)
}
