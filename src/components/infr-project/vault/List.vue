<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import { useMessageStore } from '@/stores/message'
import { useAuth } from '@/plugins/auth'

import TableAndPaging, { TableField } from '@/common/TableAndPaging.vue'
import { VaultView,VaultApiFactory } from './vault'
import VuetifyModal from '@/common/VuetifyModal.vue'

const store = useMessageStore()
const { msg } = storeToRefs(store)
const authService = useAuth()

const vaults = ref<VaultView[]>([])
const isLoading = ref(true)
const limit = ref(30)
const page = ref(1)
const dialog = ref(false)

const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await VaultApiFactory().v1VaultGet()
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    vaults.value = _.orderBy(data, "key", "desc")
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
        key: 'key',
        label: 'Key'
    },
    {
        key: 'mask_value',
        label: 'MaskValue'
    },
    {
        key: 'storage_media',
        label: 'StorageMedia'
    },
    {
        key: 'vault_type',
        label: 'VaultType',
    },
    {
        key: 'type_identity',
        label: 'TypeIdentity'
    },
    {
        key: 'tags',
        label: 'Tags',
    }
]
 

</script>

<template>
    <v-sheet class="d-flex flex-column" height="100%">
        <v-toolbar color="blue-lighten-5">
            <v-toolbar-title>Vault</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <Spinners v-if="isLoading"></Spinners>

        <TableAndPaging :items="vaults" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <template v-slot:body_key="body">
                <router-link :to="'/vault/' + body.id" page-path="" class="detail-link" target="_blank">
                    <span>
                        {{ body.key }}
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
