import { b64toB64UrlEncoded, shaString } from './util'

export type PKCECodePair = {
    codeVerifier: string
    codeChallenge: string
    createdAt: Date
}

export class pkce {
    constructor() {
    }

    create(): PKCECodePair {
        const codeVerifier = generateCodeVerifier()
        const codeChallenge = createCodeChallenge(codeVerifier)
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

const createCodeChallenge = (codeVerifier: string): string => {
    return b64toB64UrlEncoded(shaString(codeVerifier))
}
