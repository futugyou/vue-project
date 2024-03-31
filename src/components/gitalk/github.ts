import { Octokit, App, OAuthApp } from "octokit"

export interface Comment {
    id: number
    html_url: string
    created_at: Date
    body: string
    user: GitHubUser
    reactions: Reaction
}

export interface GitHubUser {
    id: number
    avatar_url: string
    login: string
    html_url: string
}

export interface Reaction {
    id: number
    url: string
    total_count: number
}

export const getIssue = async (owner: string, repo: string, issue_number: number) => {
    const app = new OAuthApp({
        clientId: import.meta.env.REACT_APP_GITTALK_CLIENTID,
        clientSecret: import.meta.env.REACT_APP_GITTALK_CLIENTSECRET,
    })

    const response = await app.octokit.rest.issues.get({ owner, repo, issue_number })

    return response
}

export const getIssueComments = async (owner: string, repo: string, issue_number: number) => {
    const app = new OAuthApp({
        clientId: import.meta.env.REACT_APP_GITTALK_CLIENTID,
        clientSecret: import.meta.env.REACT_APP_GITTALK_CLIENTSECRET,
    })

    const response = await app.octokit.rest.issues.listComments({ owner, repo, issue_number })

    return response
}

export const githubLogin = async (code: string) => {
    const url = "https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token"
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify({
                code,
                client_id: import.meta.env.REACT_APP_GITTALK_CLIENTID,
                client_secret: import.meta.env.REACT_APP_GITTALK_CLIENTSECRET,
            }),
        })

        const { access_token } = await response.json()
        const octokit = new Octokit({ auth: access_token })
        const { data } = await octokit.request("GET /user")
        return data as GitHubUser
    } catch (error) {
        return undefined
    }
}