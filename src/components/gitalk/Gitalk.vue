<script lang="ts" setup>
import { ref, watch, watchEffect, computed } from 'vue'
import { useBrowserLocation } from '@vueuse/core'
import { marked } from 'marked'
import moment from 'moment'
import _ from 'lodash-es'

import { getIssue, getIssueComments, Comment, githubLogin, GitHubUser, Issue } from './github'
import { queryStringify } from '@/tools/util'
import Like from '@/icons/Like.vue'
import Reply from '@/icons/Reply.vue'
import GithubIcon from '@/icons/Github.vue'
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
const per_page = props.per_page == 0 ? 30 : props.per_page

const location = useBrowserLocation()

const issue = ref<Issue>({} as Issue)
const comments = ref<Comment[]>([])
const loginUser = ref<GitHubUser>()
const userinput = ref<string>("")
const showMark = ref<boolean>(false)
const page = ref(0)
const userinputMark = computed(() => userinput.value)

const fetchComments = async () => {
    const { data, err } = await getIssueComments(props.owner, props.repo, props.issue_number, props.clientID, props.clientSecret, per_page, page.value)
    if (err.status != 200) {
        console.log("some error")
        return
    }

    comments.value = comments.value.concat(_.reverse(data))
}

const fetchIssue = async () => {
    const { data, err } = await getIssue(props.owner, props.repo, props.issue_number, props.clientID, props.clientSecret)
    if (err.status != 200) {
        console.log("some error")
        return
    }

    issue.value = data
}

watchEffect(async () => {
    await fetchIssue()
})

watch(
    () => [issue],
    async () => {
        if (issue.value.comments > 0 && page.value == 0) {
            const commentCount = issue.value.comments
            let pagecount = parseInt(commentCount / per_page + "")
            if (commentCount % per_page != 0) {
                pagecount = pagecount + 1
            }
            page.value = pagecount
        }
    },
    { deep: true }
)

watch(
    () => [page],
    async () => {
        if (issue.value.comments > 0 && page.value > 0) {
            await fetchComments()
        }
    },
    { deep: true }
)

const handleLogin = () => {
    const githubOauthUrl = 'https://github.com/login/oauth/authorize'
    const clientID = props.clientID
    const query = {
        client_id: clientID,
        redirect_uri: window.location.href,
        scope: 'public_repo'
    }

    window.location.href = `${githubOauthUrl}?${queryStringify(query)}`
}

const handleImgClick = (html_url?: string) => {
    if (html_url) {
        window.open(html_url)
    }
}

const loadmore = () => {
    if (page.value > 1) {
        page.value = page.value - 1
    }
}

watchEffect(
    async () => {
        const code = new URL(location.value.href ?? "").searchParams.get("code");
        if (code) {
            const { data, err } = await githubLogin(code, props.clientID, props.clientSecret)
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
    <div style="padding-bottom: 20px;">
        <div class="header">
            <div>
                <a :href="issue.html_url" target="_blank">{{ issue.comments ?? 0 }}</a> comments
            </div>
            <div v-if="!loginUser" class="login">
                <button @click="handleLogin">Login</button>
            </div>
            <div v-if="loginUser" class="user-avatar">
                <img :src="loginUser.avatar_url" />
            </div>
        </div>
        <div class="comment-container" style="gap: 5px;">
            <div class="comment-item">
                <div class="user-avatar" v-if="loginUser">
                    <img :src="loginUser.avatar_url" :alt="loginUser.login"
                        @click="() => handleImgClick(loginUser?.html_url)" />
                </div>
                <div class="user-avatar" v-if="!loginUser">
                    <GithubIcon></GithubIcon>
                </div>
                <div class="comment">
                    <!-- <div class="comment-body"> -->
                    <textarea v-if="!showMark" v-model="userinput" rows="5" style="border: 0px;padding: 0px;"></textarea>
                    <!-- </div> -->
                    <div class="comment-body" v-if="showMark" v-html="marked(userinput)">
                    </div>
                </div>
            </div>
            <div class="btn-group">
                <!-- <button v-if="!loginUser">Login</button> -->
                <button v-if="loginUser">Submit</button>
                <button @click="() => showMark = !showMark">{{ showMark ? "Edit" : "Preview" }}</button>
            </div>
        </div>
        <div class="comment-container">
            <div v-for="comment  in comments" :key="comment.id" class="comment-item">
                <div class="user-avatar" @click="() => handleImgClick(comment.user.html_url)">
                    <img :src="comment.user.avatar_url" :alt="comment.user.login" />
                    <!-- <ImageSvg :title="comment.user.login" :href="comment.user.avatar_url" height="35" width="35"></ImageSvg> -->
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
        <button v-if="page != 0 && page != 1" @click="loadmore">Load More</button>
    </div>
</template>

<style scoped lang="scss">
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
    user-select: text;
}

button {
    padding: 2px 10px;
    border: rgba(84, 174, 255, 0.4) 1px solid;
    width: 100px;
    height: 30px;
    white-space: pre;
}

button:hover {
    box-shadow: 2px 2px 2px 2px rgb(0 0 255 / 20%);
}

.btn-group {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: row;
    height: 40px;
    gap: 15px;
    user-select: none;
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
