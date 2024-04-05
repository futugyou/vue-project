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
    access_token: string
}

export interface Reaction {
    id: number
    url: string
    total_count: number
    viewerHasReacted: boolean
    nodes: ReactionNested[]
}

export interface ReactionNested {
    id: number
    login: string
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

export const getGraphQLIssueComments = async (owner: string, repo: string, issue_number: number, per_page: number, cursor: string | null, access_token: string) => {
    let startCursor: string | null = null
    let data: Comment[] = []
    let err: Error = { message: "", status: 200, }

    try {
        const octokit = new Octokit({ auth: access_token })
        const result: any = await octokit.graphql(
            `
            query getComments($owner: String!, $repo: String!, $id: Int!, $cursor: String, $pageSize: Int!) {
                repository(owner: $owner, name: $repo) {
                  issue(number: $id) {
                    number
                    url
                    title
                    comments(last: $pageSize, before: $cursor) {
                      totalCount
                      pageInfo {
                        hasPreviousPage
                        startCursor
                      }
                      nodes { 
                        databaseId
                        url
                        body
                        createdAt
                        author {
                          avatarUrl
                          login
                          url
                        }
                        reactions(first: 100, content: HEART) {
                          totalCount
                          viewerHasReacted
                          pageInfo {
                            hasNextPage
                          }
                          nodes {
                            id
                            databaseId
                            user {
                              login
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
            {
                "owner": owner,
                "repo": repo,
                "id": issue_number,
                "pageSize": per_page,
                "cursor": cursor
            },
        )

        if (result && result.repository && result.repository.issue && result.repository.issue.comments) {
            startCursor = result.repository.issue.comments.pageInfo.startCursor
            const nodes = result.repository.issue.comments.nodes as any[]
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i]
                data.push({
                    id: node.databaseId,
                    html_url: node.url,
                    created_at: node.createdAt,
                    body: node.body,
                    user: {
                        id: 0,
                        avatar_url: node.author?.avatarUrl,
                        login: node.author?.login,
                        html_url: node.author?.url,
                        access_token: ""
                    },
                    reactions: {
                        id: 0,
                        url: "",
                        total_count: node.reactions?.totalCount ?? 0,
                        viewerHasReacted: node.reactions?.viewerHasReacted ?? false,
                        nodes: (node.reactions?.nodes as []).map((p: any) => {
                            return {
                                "id": p.databaseId,
                                "login": p.user?.login ?? ""
                            }
                        })
                    }
                })
            }
        }
    } catch (error) {
        if (error instanceof RequestError) {
            err.message = error.message
            err.status = error.status
        } else {
            err.status = 500
            err.message = JSON.stringify(error)
        }
    }

    return { data, err, startCursor }
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

export const likeIssueComment = async (owner: string, repo: string, comment_id: number, access_token: string) => {
    let err: Error = { message: "", status: 200, }
    let id = 0
    try {
        const octokit = new Octokit({ auth: access_token })
        const { data } = await octokit.rest.reactions.createForIssueComment({ owner, repo, comment_id, content: "heart" })
        id = data.id
    } catch (error) {
        if (error instanceof RequestError) {
            err.message = error.message
            err.status = error.status
        } else {
            err.status = 500
            err.message = JSON.stringify(error)
        }
    }

    return { id, err }
}

export const unLikeIssueComment = async (owner: string, repo: string, comment_id: number, reaction_id: number, access_token: string) => {
    let err: Error = { message: "", status: 200, }

    try {
        const octokit = new Octokit({ auth: access_token })
        await octokit.rest.reactions.deleteForIssueComment({ owner, repo, comment_id, reaction_id })
    } catch (error) {
        if (error instanceof RequestError) {
            err.message = error.message
            err.status = error.status
        } else {
            err.status = 500
            err.message = JSON.stringify(error)
        }
    }

    return { err }
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
        let tmp = { ...data, access_token: access_token }
        result = tmp as GitHubUser
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