<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue'
import { getIssueById } from './github'


export interface IGitalkProps {
    clientID: string
    clientSecret: string
    repo: string
    owner: string
}

const props = defineProps<IGitalkProps>()

const issue = ref<any>({})

const fetchIssue = async () => {
    const { data, status } = await getIssueById()
    if (status != 200) {
        console.log("some error")
        return
    }

    issue.value = data
}

watchEffect(async () => fetchIssue())


</script>

<template>
    <div>
        <ul>
            <li v-for="(val, index) in issue" :key="index">
                {{ index }} {{ val }}
            </li>
        </ul>
    </div>
</template>

<style scoped></style>
