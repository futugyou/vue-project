import { Octokit, App } from "octokit"

const owner = import.meta.env.REACT_APP_GITTALK_OWNER
const repo = import.meta.env.REACT_APP_GITTALK_REPO
const issue_number = import.meta.env.REACT_APP_GITTALK_NUMBER

export const getIssueById = async () => {
    const octokit = new Octokit({
        // auth: 'YOUR-TOKEN'
    })

    const response = await octokit.rest.issues.get({ owner, repo, issue_number })

    return response
}