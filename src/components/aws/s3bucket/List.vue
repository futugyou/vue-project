<script lang="ts" setup>
import { ref, watchEffect } from 'vue'

import TableAndPaging, { TableField } from '@/common/TableAndPaging.vue'
import VuetifyModal from '@/common/VuetifyModal.vue'
import Detail from './Detail.vue'

import { S3Bucket, getS3Buckets } from './s3bucket'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const buckets = ref<S3Bucket[]>([])
const selecedBucket = ref<S3Bucket>()

const searchKey = ref<string>('')
const isLoading = ref(true)
const dialog = ref(false)

const limit = ref(30)
const page = ref(1)

const fields: TableField[] = [
    {
        key: 'name',
        label: 'BucketName',
        header: true
    },
    {
        key: 'accountName',
        label: 'AccountName'
    },
    {
        key: 'region',
        label: 'Region'
    },
    {
        key: 'isPublic',
        label: 'IsPublic'
    },
    {
        key: 'creationDate',
        label: 'CreationDate',
    }
]

const fetchData = async () => {
    buckets.value = []
    isLoading.value = true
    const { data, error } = await getS3Buckets(page.value, limit.value, searchKey.value)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    buckets.value = data ?? []
}

watchEffect(async () => fetchData())

const updatePage = (n: number) => {
    page.value = n
}

const changePagesize = (n: number) => {
    limit.value = n
}

const showS2Resource = (r: S3Bucket) => {
    selecedBucket.value = r
    dialog.value = true
}

</script>

<template>
    <v-sheet class="d-flex flex-column" height="100%">
        <VuetifyModal text="Choose an archive in S3" title="Choose an archive in S3" activator="somme" hideFooter
            v-model:dialog="dialog">
            <Detail :key="selecedBucket?.id" :s3Bucket="selecedBucket" v-if="selecedBucket"> </Detail>
        </VuetifyModal>

        <v-toolbar>
            <v-toolbar-title>S3 Bucket</v-toolbar-title>
            <label class="text-subtitle-1 mr-2" for="searchKey">
                Key:
            </label>
            <v-text-field clearable variant="outlined" v-model="searchKey"></v-text-field>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
        </v-toolbar>
        <TableAndPaging :items="buckets" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <template v-slot:body_name="body">
                <span className="detail-link" @click="showS2Resource(body)">
                    {{ body.name }}
                </span>
            </template>
        </TableAndPaging>
    </v-sheet>
</template>
