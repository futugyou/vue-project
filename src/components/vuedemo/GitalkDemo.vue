<script lang="ts" setup>
import Gitalk from '@/common/gitalk/Gitalk.vue'

const clientID = import.meta.env.VUE_APP_GITTALK_CLIENTID
const clientSecret = import.meta.env.VUE_APP_GITTALK_CLIENTSECRET
const repo = import.meta.env.VUE_APP_GITTALK_REPO
const owner = import.meta.env.VUE_APP_GITTALK_OWNER
// ??? 
// [Vue warn]= Invalid prop= type check failed for prop "issue_number". Expected Number with value 1 got String with value "1". 
const issue_number = parseInt(import.meta.env.VUE_APP_GITTALK_NUMBER + "")
const per_page = parseInt(import.meta.env.VUE_APP_GITTALK_PRE_PAGE + "")

</script>

<template>
    <Gitalk :client-i-d="clientID" :client-secret="clientSecret" :repo="repo" :owner="owner" :issue_number="issue_number"
        :per_page="per_page">
    </Gitalk>
</template>

<style scoped></style>
