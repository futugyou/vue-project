<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue'
import { getIssue, getIssueComments, Comment } from './github'


export interface IGitalkProps {
    clientID: string
    clientSecret: string
    repo: string
    owner: string
}

const props = defineProps<IGitalkProps>()

const owner = import.meta.env.REACT_APP_GITTALK_OWNER
const repo = import.meta.env.REACT_APP_GITTALK_REPO
const issue_number = import.meta.env.REACT_APP_GITTALK_NUMBER

const comments = ref<Comment[]>([])

const fetchComments = async () => {
    const { data, status } = await getIssueComments(owner, repo, issue_number)
    if (status != 200) {
        console.log("some error")
        return
    }

    comments.value = data as unknown as Comment[]
}

watchEffect(async () => fetchComments())


</script>

<template>
    <div>
        <ul v-for=" comment  in comments" :key="comment.id">
            <li v-for="(val, index) in comment" :key="index">
                {{ index }} {{ val }}
            </li>
        </ul>
    </div>
</template>

<style scoped></style>
