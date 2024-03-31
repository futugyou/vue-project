<script lang="ts" setup>
import { queryStringify } from '@/tools/util'
import { ref, watch, watchEffect } from 'vue'
import { getIssue, getIssueComments, Comment, githubLogin, GitHubUser } from './github'
import { useBrowserLocation } from '@vueuse/core'

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
    const { data, status } = await getIssueComments(owner, repo, issue_number)
    if (status != 200) {
        console.log("some error")
        return
    }

    comments.value = data as unknown as Comment[]
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

watchEffect(
    async () => {
        const code = new URL(location.value.href ?? "").searchParams.get("code");
        if (code) {
            loginUser.value = await githubLogin(code)
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
        <ul v-for=" comment  in comments" :key="comment.id">
            <li v-for="(val, index) in comment" :key="index">
                {{ index }} {{ val }}
            </li>
        </ul>
    </div>
</template>

<style scoped></style>
