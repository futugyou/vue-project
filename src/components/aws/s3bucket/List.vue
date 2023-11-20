<script lang="ts" setup>
import { ref, watchEffect } from 'vue'

import TableAndPaging, { TableField } from '@/components/TableAndPaging.vue'
import { Modal, openModal } from '@/components/Modal.vue'

import { S3Bucket, getS3Buckets } from './s3bucket'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const buckets = ref<S3Bucket[]>([])

const searchKey = ref<string>('')
const isLoading = ref(true)

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

const handleKeyworkChange = (e: any) => {
    const k: string = e.target.value;
    searchKey.value = k
}

const showS2Resource = (r: S3Bucket) => {
    openModal('s3resourceModal')
}
</script>

<template>
    <div class="full-content">
        <Modal id="s3resourceModal" title="s3 resource" :hideFooter="true" size="xl">
            <div>ok</div>
        </Modal>

        <div class="head-content">
            <div class="">
                <h1>S3 Bucket</h1>
            </div>
            <div class="search-contatiner">
                <div class="search-item-contatiner">
                    <div class="search-item-lable">
                        <label class="form-check-label" for="searchKey">
                            BucketName:
                        </label>
                    </div>
                    <div class="search-item-com">
                        <input id="searchKey" :value="searchKey" @change="handleKeyworkChange" />
                    </div>
                </div>
            </div>
        </div>
        <TableAndPaging :items="buckets" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <template v-slot:body_name="body">
                <span className="detail-link" @click="showS2Resource(body)">
                    {{ body.name }}
                </span>
            </template>
        </TableAndPaging>
    </div>
</template>

<style scoped>
.full-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}

.head-content {
    display: flex;
    align-items: center;
    padding: 0px 10px;
    justify-content: flex-start;
    grid-gap: 50px;
}

.head-content h1 {
    margin: 0;
}

.detail-link {
    width: 100%;
    height: 100%;
    display: block;
    color: var(--color-text-link-default, #0972d3);
    text-underline-offset: 0.25em;
    text-decoration-thickness: 1px;
}

.detail-link:hover {
    text-decoration-line: underline;
    text-decoration-color: initial;
    cursor: pointer;
    color: var(--color-text-link-hover, #033160);
}

.gap-right-10 {
    margin-right: 20px;
}

.search-contatiner {
    display: flex;
    flex-direction: row;
    height: 40px;
}

div.search-contatiner>* {
    height: 100%;
}

.search-item-contatiner {
    display: flex;
    flex-direction: row;
    align-items: center;
}


.search-item-lable {
    margin-right: 10px;
    font-size: 20px;
}

.search-item-com {
    width: 200px;
    text-align: left;
}

#searchKey {
    border: 1px solid turquoise;
}
</style>
