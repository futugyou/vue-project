import { fetchEx } from '@/tools/fetch'
import { Octokit, App } from "octokit"

const owner = import.meta.env.REACT_APP_GITTALK_OWNER
const  repo= import.meta.env.REACT_APP_GITTALK_REPO
const issue_number = import.meta.env.REACT_APP_GITTALK_NUMBER

export const getIssueById = async () => {
    const octokit = new Octokit({
        // auth: 'YOUR-TOKEN'
    })

    const response = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
        owner: owner,
        repo: repo,
        issue_number: issue_number,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })

    return response
}