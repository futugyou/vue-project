import { Octokit, App } from "octokit"

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
    const octokit = new Octokit({
        // auth: 'YOUR-TOKEN'
    })

    const response = await octokit.rest.issues.get({ owner, repo, issue_number })

    return response
}

export const getIssueComments = async (owner: string, repo: string, issue_number: number) => {
    const octokit = new Octokit({
        // auth: 'YOUR-TOKEN'
    })
    const response = await octokit.rest.issues.listComments({ owner, repo, issue_number })

    return response

}