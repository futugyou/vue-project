import { Octokit, OAuthApp, RequestError } from "octokit"

export interface Comment {
    id: number
    html_url: string
    created_at: Date
    body: string
    user: GitHubUser
    reactions: Reaction
}

export interface Issue {
    id: number
    url: string
    html_url: string
    number: number
    title: string
    body?: string
    user: GitHubUser
    comments: number
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

export interface Error {
    message: string
    status: number
}

export const getIssue = async (owner: string, repo: string, issue_number: number, clientId: string, clientSecret: string) => {
    const app = new OAuthApp({
        clientId: clientId,
        clientSecret: clientSecret,
    })

    let data: Issue = {} as Issue
    let err: Error = { message: "", status: 200, }

    try {
        const response = await app.octokit.rest.issues.get({ owner, repo, issue_number })
        data = response.data as unknown as Issue
    } catch (error) {
        if (error instanceof RequestError) {
            err.message = error.message
            err.status = error.status
        } else {
            err.status = 500
            err.message = JSON.stringify(error)
        }
    }

    return { data, err }
}

export const getIssueComments = async (owner: string, repo: string, issue_number: number, clientId: string, clientSecret: string, per_page?: number, page?: number) => {
    const app = new OAuthApp({
        clientId: clientId,
        clientSecret: clientSecret,
    })

    let data: Comment[] = []
    let err: Error = { message: "", status: 200, }

    try {
        const response = await app.octokit.rest.issues.listComments({ owner, repo, issue_number, per_page, page })
        data = response.data as unknown as Comment[]
    } catch (error) {
        if (error instanceof RequestError) {
            err.message = error.message
            err.status = error.status
        } else {
            err.status = 500
            err.message = JSON.stringify(error)
        }
    }

    return { data, err }
}

export const createIssueComment = async (owner: string, repo: string, issue_number: number, body: string, access_token: string) => {
    let data: Comment = {} as Comment
    let err: Error = { message: "", status: 200, }

    try {
        const octokit = new Octokit({ auth: access_token })
        const response = await octokit.rest.issues.createComment({ owner, repo, issue_number, body })
        data = response.data as unknown as Comment
    } catch (error) {
        if (error instanceof RequestError) {
            err.message = error.message
            err.status = error.status
        } else {
            err.status = 500
            err.message = JSON.stringify(error)
        }
    }

    return { data, err }
}

export const githubLogin = async (code: string, clientId: string, clientSecret: string) => {
    const url = "https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token"

    let result: GitHubUser = {} as GitHubUser
    let err: Error = { message: "", status: 200, }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify({
                code,
                client_id: clientId,
                client_secret: clientSecret,
            }),
        })

        const { access_token } = await response.json()
        const octokit = new Octokit({ auth: access_token })
        const { data } = await octokit.request("GET /user")
        result = data as GitHubUser
    } catch (error) {
        if (error instanceof RequestError) {
            err.message = error.message
            err.status = error.status
        } else {
            err.status = 500
            err.message = JSON.stringify(error)
        }
    }

    return { data: result, err }
}