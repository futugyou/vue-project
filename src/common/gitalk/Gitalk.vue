<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue'
import { useBrowserLocation } from '@vueuse/core'
import { marked } from 'marked'
import moment from 'moment'
import { orderBy, uniqBy } from 'lodash-es'
import { useIDBClient } from '@/composables/useIDBClientEx'
import { useIDBRef } from '@/composables/useIDBRefEx'

import {
    getIssue, getIssueComments, githubLogin, createIssueComment,
    getGraphQLIssueComments, likeIssueComment, unLikeIssueComment
} from './github'

import type { Comment, GitHubUser, Issue } from './github'

import { queryStringify } from '@/tools/util'
import Like from '@/icons/Like.vue'
import Reply from '@/icons/Reply.vue'
import GithubIcon from '@/icons/Github.vue'
import Button from '@/common/SimpleButton.vue'
import ImageSvg from '@/icons/ImageSvg.vue'

export interface IGitalkProps {
    clientID: string
    clientSecret: string
    repo: string
    owner: string
    issue_number: number
    per_page: number
}

const props = defineProps<IGitalkProps>()
const page = ref(0)
const per_page = (props.per_page <= 0 || props.per_page == undefined) ? 30 : props.per_page

const location = useBrowserLocation()
const issue = ref<Issue>({} as Issue)
const comments = ref<Comment[]>([])
// this is used by display 'markdown' or 'raw' text
const commentMark = ref<boolean[]>([])
const userComment = ref<string>("")

const db = useIDBClient('gittalk', ['user', 'tmp'])
const loginUser = useIDBRef<GitHubUser>(db, 'user', props.owner + props.repo + "_user")
// store user comment when user redirect to github login page
const tmpComment = useIDBRef<string>(db, 'tmp', props.owner + props.repo + props.issue_number + "_comment", "")

const showMarkdown = ref<boolean>(false)
const isLoading = ref(false)
let cursor: string | null = null

const fetchIssue = async () => {
    if (issue.value != undefined && issue.value.id != undefined) {
        return
    }

    const { data, err } = await getIssue(props.owner, props.repo, props.issue_number, props.clientID, props.clientSecret)
    if (err.status != 200) {
        console.log("some error")
        return
    }

    issue.value = data
}

const fetchComments = async () => {
    let commends: Comment[] = []
    if (loginUser.value && loginUser.value.access_token) {
        const { data, err, startCursor } = await getGraphQLIssueComments(props.owner, props.repo, props.issue_number, per_page, cursor, loginUser.value.access_token)
        if (err.status != 200) {
            console.log("some error")
            return
        }

        commends = data
        cursor = startCursor
    } else {
        const { data, err } = await getIssueComments(props.owner, props.repo, props.issue_number, props.clientID, props.clientSecret, per_page, page.value)
        if (err.status != 200) {
            console.log("some error")
            return
        }

        commends = data
    }

    comments.value = orderBy(uniqBy(commends.concat(comments.value), "id"), "id", "desc")
}

const handleLogin = () => {
    let href = window.location.href
    if (window.rawWindow && window.rawWindow.location) {
        href = window.rawWindow.location.href
    }
    tmpComment.value = userComment.value
    const githubOauthUrl = 'https://github.com/login/oauth/authorize'
    const query = {
        client_id: props.clientID,
        redirect_uri: href,
        scope: 'public_repo'
    }

    if (window.rawWindow && window.rawWindow.location) {
        window.rawWindow.location.href = `${githubOauthUrl}?${queryStringify(query)}`
    } else {
        window.location.href = `${githubOauthUrl}?${queryStringify(query)}`
    }
}

const handleImgClick = (html_url?: string) => {
    if (html_url) {
        if (window.rawWindow) {
            window.rawWindow.open(html_url)
        } else {
            window.open(html_url)
        }
    }
}

const loadmore = () => {
    if (page.value > 1) {
        page.value = page.value - 1
    }
}

const addReply = (body: string) => {
    let commend = userComment.value.trim()
    const subs = body.split("\r\n")
    for (let i = 0; i < subs.length; i++) {
        const sub = subs[i]
        if (i == 0) {
            if (commend.length != 0) {
                commend = commend + "\r\n\r\n"
            }
        } else {
            commend = commend + "\r\n"
        }

        commend = commend + "> " + sub
    }

    if (subs.length > 0) {
        commend = commend + "\r\n\r\n"
    }

    userComment.value = commend
}

const updateReaction = async (commend: Comment) => {
    if (loginUser.value == undefined || loginUser.value.access_token == undefined
        || loginUser.value.access_token.trim().length == 0) {
        // TODO: tip login
        return
    }

    let tmp = commend
    const f = commend.reactions.viewerHasReacted ?? false
    if (f) {
        const reaction_id = commend.reactions.nodes.find(p => p.login == loginUser.value.login)?.id ?? 0
        if (reaction_id == 0) {
            return
        }

        const { err } = await unLikeIssueComment(props.owner, props.repo, commend.id, reaction_id, loginUser.value.access_token)
        if (err.status == 200) {
            tmp = {
                ...tmp,
                reactions: {
                    ...tmp.reactions,
                    viewerHasReacted: false,
                    nodes: tmp.reactions.nodes.filter(p => p.login != loginUser.value.login),
                },
            }
        }
    } else {
        const { id, err } = await likeIssueComment(props.owner, props.repo, commend.id, loginUser.value.access_token)
        if (err.status == 200) {
            let nodes = tmp.reactions.nodes ?? []
            tmp = {
                ...tmp,
                reactions: {
                    ...tmp.reactions,
                    viewerHasReacted: true,
                    nodes: nodes.findIndex(p => p.login == loginUser.value.login) >= 0 ? nodes : nodes.concat({ id: id, login: loginUser.value.login }),
                },
            }
        }
    }

    comments.value = comments.value.map(p => {
        if (p.id == tmp.id) {
            return tmp
        } else {
            return { ...p }
        }
    })
}

const createComment = async () => {
    if (userComment.value.trim().length == 0) {
        return
    }

    if (loginUser.value == undefined || loginUser.value.access_token == undefined
        || loginUser.value.access_token.trim().length == 0) {
        // TODO: tip login
        return
    }

    isLoading.value = true
    const { data, err } = await createIssueComment(props.owner, props.repo, props.issue_number, userComment.value, loginUser.value.access_token)
    if (err.status != 200) {
        console.log("some error")
        isLoading.value = false
        return
    }

    comments.value = [data].concat(comments.value)
    userComment.value = ""
    isLoading.value = false
}

const logout = async () => {
    await loginUser.remove()
}

// page init, load issue data
watchEffect(async () => {
    await fetchIssue()
})

// calculate actual page No.
watchEffect(
    () => {
        if (issue.value.comments > 0 && page.value == 0) {
            const commentCount = issue.value.comments
            let pagecount = parseInt(commentCount / per_page + "")
            if (commentCount % per_page != 0) {
                pagecount = pagecount + 1
            }
            page.value = pagecount
            commentMark.value = []
        }
    }
)

// page No. change to load more comments
watchEffect(
    async () => {
        if (issue.value.comments > 0 && page.value > 0) {
            isLoading.value = true
            await fetchComments()
            isLoading.value = false
        }
    }
)

// github user login callback
watchEffect(
    async () => {
        let href = location.value.href ?? ""
        let pathname = location.value.pathname ?? ""
        let search = location.value.search
        let history = window.history
        if (window.rawWindow) {
            href = window.rawWindow.location.href ?? ""
            pathname = window.rawWindow.location.pathname ?? ""
            search = window.rawWindow.location.search
            history = window.rawWindow.history
        }

        const code = new URL(href).searchParams.get("code");
        if (code) {
            userComment.value = tmpComment.value
            tmpComment.value = ""
            isLoading.value = true
            const { data, err } = await githubLogin(code, props.clientID, props.clientSecret)
            if (err.status != 200) {
                await loginUser.remove()
                isLoading.value = false
                // TODO
                return
            }

            loginUser.value = data
            const path = pathname + search?.replace(/\b(code|state)=\w+/g, "").replace(/[?&]+$/, "")
            history.replaceState({}, "", path)
            isLoading.value = false
        }
    }
)

// comment textarea focus
const textarearef = ref<HTMLTextAreaElement>()
watch(
    () => userComment,
    () => {
        if (userComment.value.trim().length > 0 && textarearef.value) {
            textarearef.value.focus()
            textarearef.value.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' })
        }
    },
    { deep: true, immediate: true, }
)

</script>

<template>
    <div style="padding-bottom: 20px;">
        <div class="header">
            <div>
                <a :href="issue.html_url" target="_blank">{{ issue.comments ?? 0 }}</a> comments
            </div>
            <div v-if="!loginUser.value" class="login">
                <Button Text="Login" @click="handleLogin" :IsLoading="isLoading"></Button>
            </div>
            <div v-if="loginUser.value" class="user-avatar">
                <img :src="loginUser.value.avatar_url" />
                <div class="logout">
                    <Button Text="Logout" @click="logout" :IsLoading="isLoading"></Button>
                </div>
            </div>
        </div>
        <div class="comment-container" style="gap: 5px;">
            <div class="comment-item">
                <div class="user-avatar" v-if="loginUser.value">
                    <img :src="loginUser.value.avatar_url" :alt="loginUser.value.login"
                        @click="() => handleImgClick(loginUser.value.html_url)" />
                </div>
                <div class="user-avatar" v-if="!loginUser">
                    <GithubIcon></GithubIcon>
                </div>
                <div class="comment">
                    <!-- <div class="comment-body"> -->
                    <textarea flag id="textarea" v-if="!showMarkdown" v-model="userComment" rows="5" ref="textarearef"
                        :disabled="isLoading"></textarea>
                    <!-- </div> -->
                    <div class="comment-body" v-if="showMarkdown" v-html="marked(userComment)">
                    </div>
                </div>
            </div>
            <div class="btn-group">
                <!-- <button v-if="!loginUser">Login</button> -->
                <Button Text="Submit" v-if="loginUser.value" :IsLoading="isLoading" @click="createComment"></Button>
                <Button :Text='showMarkdown ? "Edit" : "Preview"' :IsLoading="isLoading"
                    @click="() => showMarkdown = !showMarkdown"></Button>
            </div>
        </div>
        <div class="comment-container">
            <div v-for="(comment, index) in comments" :key="comment.id" class="comment-item">
                <div class="user-avatar" @click="() => handleImgClick(comment.user.html_url)">
                    <img :src="comment.user.avatar_url" :alt="comment.user.login" />
                    <!-- <ImageSvg :title="comment.user.login" :href="comment.user.avatar_url" height="35" width="35"></ImageSvg> -->
                </div>
                <div class="comment">
                    <div class="comment-head">
                        <div>
                            <div><a :href="comment.user.html_url" target="_blank">{{ comment.user.login }}</a> </div>
                            <div>created at: {{ moment(comment.created_at).fromNow() }}</div>
                            <div>
                                <span v-if="!commentMark[index]"
                                    @click="commentMark[index] = !commentMark[index]">code</span>
                                <span v-if="commentMark[index]"
                                    @click="commentMark[index] = !commentMark[index]">marked</span>
                            </div>
                        </div>
                        <div>
                            <div>
                                <Like :class="comment.reactions.viewerHasReacted ? 'like' : ''"
                                    @click="() => updateReaction(comment)"></Like>
                            </div>
                            <div>
                                <Reply @click="() => addReply(comment.body)"></Reply>
                            </div>
                        </div>
                    </div>
                    <div v-if="!commentMark[index]" class="comment-body" v-html="marked(comment.body)"></div>
                    <textarea flag rows="5" v-if="commentMark[index]" readonly class="comment-body"
                        v-html="comment.body"></textarea>
                </div>
            </div>
        </div>

        <div v-if="page != 0 && page != 1" style="display: flex;align-items: center;justify-content: center;">
            <Button Text="Load More" @click="loadmore" :IsLoading="isLoading"></Button>
        </div>
    </div>
</template>

<style scoped lang="scss">
textarea {
    max-height: 200px;
    overflow-y: auto;
    border: 0px;
    padding: 0px;
}

.comment-head svg.like :deep(path) {
    fill: red;
}

.header {
    font-size: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 30px;
    border-bottom: #54aeff66 1px solid;
    margin-bottom: 10px;
    user-select: none;
}

.login a {
    padding: 10px;
    cursor: pointer;
    width: 80px;
}

.user-avatar {
    position: relative;
}

.user-avatar .logout {
    display: none;
    position: absolute;
}

.user-avatar:hover .logout {
    top: 35px;
    right: -20px;
    display: block;
}

.comment-container {
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 20px;
    user-select: none;
}

.comment-item {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.user-avatar {
    width: 35px;
    height: 35px;
}


.user-avatar img {
    width: 30px;
    border-radius: 50%;
    cursor: pointer;
}

.user-avatar svg {
    width: 35px;
    border-radius: 50%;
    cursor: pointer;
}

.user-avatar img:hover {
    width: 35px;
}

.comment {
    display: flex;
    flex-direction: column;
    text-align: left;
    flex: 1;
    padding: 10px;
    border: #54aeff66 1px solid;
    border-radius: 10px;
    /* background-color: #f0f8ff; */
}

.comment-body {
    min-height: 40px;
    user-select: text;
}

.btn-group {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: row;
    height: 40px;
    gap: 15px;
    user-select: none;
    padding: 0px 20px;
}

.comment:hover {
    box-shadow: 4px 4px 2px 1px rgb(0 0 255 / 20%);
}

.comment :deep(ul) {
    list-style: unset;
}

.comment :deep(thead),
.comment :deep(tbody),
.comment :deep(tfoot),
.comment :deep(tr),
.comment :deep(td),
.comment :deep(th) {
    border-width: 1px;
    border-color: #d0d7deb3;
}

.comment :deep(td),
.comment :deep(th) {
    padding: 6px 13px;
}

.comment :deep(th) {
    font-weight: 600;
}

.comment :deep(tr:nth-child(2n)) {
    background-color: #f6f8fa;
}

.comment :deep(blockquote) {
    padding: 0 1em;
    color: #636c76;
    border-left: 0.25em solid #d0d7de;
}

.comment :deep(pre) {
    min-height: 52px;
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    color: #1f2328;
    background-color: #f6f8fa;
    border-radius: 6px;
}

.comment-head {
    font-size: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0px 10px;
}

.comment-head>div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
}

.comment-head span {
    display: flex;
    padding: 2px 10px;
    cursor: pointer;
    border-radius: 10px;

    &:hover {
        background-color: #d0d7deb3;
    }
}

.comment-head svg {
    display: flex;
    fill: #54aeff66;
    width: 14px;
    cursor: pointer;
}
</style>
