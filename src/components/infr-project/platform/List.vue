<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import { useMessageStore } from '@/stores/message'
import { useAuth } from '@/plugins/auth'

import TableAndPaging, { TableField } from '@/common/TableAndPaging.vue'
import { PlatformView, PlatformApiFactory, PlatformDetailView } from './platform'
import VuetifyModal from '@/common/VuetifyModal.vue'
import Basic from './Basic.vue'

const store = useMessageStore()
const { msg } = storeToRefs(store)
const authService = useAuth()

const platforms = ref<PlatformView[]>([])
const isLoading = ref(true)
const limit = ref(30)
const page = ref(1)
const dialog = ref(false)

const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await PlatformApiFactory().v1PlatformGet()
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    platforms.value = _.orderBy(data, "updated_at", "desc")
}

watchEffect(async () => fetchData())

const updatePage = (n: number) => {
    page.value = n
}

const changePagesize = (n: number) => {
    limit.value = n
}

const fields: TableField[] = [
    {
        key: 'name',
        label: 'Name'
    },
    {
        key: 'url',
        label: 'URL'
    },
    {
        key: 'activate',
        label: 'Activate'
    },
    {
        key: 'is_deleted',
        label: 'Deleted'
    },
    {
        key: 'rest_endpoint',
        label: 'RestEndpoint',
    },
    {
        key: 'tags',
        label: 'Tags',
    }
]

const platformCreated = (view: PlatformDetailView) => {
    dialog.value = false
}

const platformCreateCanceled = () => {
    dialog.value = false
}

</script>

<template>
    <v-sheet class="d-flex flex-column" height="100%">
        <v-toolbar color="blue-lighten-5">
            <v-toolbar-title>Platform</v-toolbar-title>
            <v-spacer></v-spacer>
            <VuetifyModal v-model:dialog="dialog" text="Create Platform" :width="700" title="Create Platform" hideFooter
                v-if="authService.isAuthenticated()">
                <Basic @cancel="platformCreateCanceled" @save="platformCreated"></Basic>
            </VuetifyModal>
        </v-toolbar>
        <Spinners v-if="isLoading"></Spinners>

        <TableAndPaging :items="platforms" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <template v-slot:body_name="body">
                <router-link :to="'/platform/' + body.id" page-path="" class="detail-link" target="_blank">
                    <span>
                        {{ body.name }}
                    </span>
                </router-link>
            </template>
            <template v-slot:body_tags="body">
                <v-sheet class="d-flex flex-wrap ga-2">
                    <v-chip v-for="tag in body.tags">
                        <strong>{{ tag }}</strong>&nbsp;
                    </v-chip>
                </v-sheet>
            </template>
        </TableAndPaging>

    </v-sheet>
</template>

<style scoped>
a:active,
a:hover {
    outline-width: 0;
    background-color: transparent;
}
</style>
