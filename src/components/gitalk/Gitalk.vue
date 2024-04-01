<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue'
import { useBrowserLocation } from '@vueuse/core'
import { marked } from 'marked'
import moment from 'moment'

import { getIssue, getIssueComments, Comment, githubLogin, GitHubUser } from './github'
import { queryStringify } from '@/tools/util'
import Like from '@/icons/Like.vue'
import Reply from '@/icons/Reply.vue'

export interface IGitalkProps {
    // clientID: string
    // clientSecret: string
    // repo: string
    // owner: string
}

const props = defineProps<IGitalkProps>()

const location = useBrowserLocation()

const owner = import.meta.env.REACT_APP_GITTALK_OWNER
const repo = import.meta.env.REACT_APP_GITTALK_REPO
const issue_number = import.meta.env.REACT_APP_GITTALK_NUMBER

const comments = ref<Comment[]>([])
const loginUser = ref<GitHubUser>()

const fetchComments = async () => {
    const { data, err } = await getIssueComments(owner, repo, issue_number)
    if (err.status != 200) {
        console.log("some error")
        return
    }

    comments.value = data
}

watchEffect(async () => fetchComments())

const handleLogin = () => {
    const githubOauthUrl = 'https://github.com/login/oauth/authorize'
    const clientID = import.meta.env.REACT_APP_GITTALK_CLIENTID
    const query = {
        client_id: clientID,
        redirect_uri: window.location.href,
        scope: 'public_repo'
    }

    window.location.href = `${githubOauthUrl}?${queryStringify(query)}`
}

const handleImgClick = (html_url: string) => {
    window.open(html_url)
}

watchEffect(
    async () => {
        const code = new URL(location.value.href ?? "").searchParams.get("code");
        if (code) {
            const { data, err } = await githubLogin(code)
            if (err.status != 200) {
                loginUser.value = undefined
                // TODO
                return
            }

            loginUser.value = data
            const path = (location.value.pathname ?? "")
                + location.value.search?.replace(/\b(code|state)=\w+/g, "").replace(/[?&]+$/, "")
            history.replaceState({}, "", path)
        }
    }
)

</script>

<template>
    <div>
        <div>
            <div v-if="!loginUser">
                <a @click="handleLogin">
                    Login
                </a>
            </div>
            <div v-if="loginUser">
                <img :src="loginUser.avatar_url" />
            </div>
        </div>
        <div class="comment-container">
            <div v-for="comment  in comments" :key="comment.id" class="comment-item">
                <div class="user-avatar">
                    <img :src="comment.user.avatar_url" :alt="comment.user.login"
                        @click="() => handleImgClick(comment.user.html_url)" />
                </div>
                <div class="comment">
                    <div class="comment-head">
                        <div>
                            <div><a :href="comment.user.html_url" target="_blank">{{ comment.user.login }}</a> </div>
                            <div>created at: {{ moment(comment.created_at).fromNow() }}</div>
                        </div>
                        <div>
                            <div>
                                <Like></Like>
                            </div>
                            <div>
                                <Reply></Reply>
                            </div>
                        </div>
                    </div>
                    <div class="comment-body" v-html="marked(comment.body)"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped >
.comment-container {
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 20px;
}

.comment-item {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.user-avatar {
    width: 50px;
}

.user-avatar img {
    width: 40px;
    border-radius: 50%;
    cursor: pointer;
}

.user-avatar img:hover {
    width: 50px;
}

.comment {
    text-align: left;
    flex: 1;
    padding: 10px;
    border: #54aeff66 1px solid;
    border-radius: 10px;
    /* background-color: #f0f8ff; */
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

.comment-head svg {
    display: flex;
    fill: #54aeff66;
    width: 14px;
    cursor: pointer;
}
</style>
