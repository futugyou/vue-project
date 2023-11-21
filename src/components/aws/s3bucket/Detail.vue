<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue'

import TableAndPaging, { TableField } from '@/components/TableAndPaging.vue'

import { S3Bucket, defaultS3Bucket, S3BucketItem, defaultS3BucketItem, getS3BucketItems, getS3ItemUrl } from './s3bucket'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'

const props = withDefaults(
    defineProps<{
        s3Bucket?: S3Bucket
        perfix: string
    }>(),
    {
        s3Bucket: () => {
            return { ...defaultS3Bucket }
        },
        perfix: () => {
            return ""
        }
    }
)

const bucket = computed(() => {
    return props.s3Bucket
})

const itemPerfix = ref<string[]>(["S3 buckets"])
const perfix = ref<string>(props.perfix)

const store = useMessageStore()
const { msg } = storeToRefs(store)

const bucketItems = ref<S3BucketItem[]>([])

const isLoading = ref(true)

const limit = ref(30)
const page = ref(1)

const fields: TableField[] = [
    {
        key: 'key',
        label: 'Key',
        header: true
    },
    {
        key: 'bucketName',
        label: 'BucketName',
    },
    {
        key: 'isDirectory',
        label: 'IsDirectory'
    },
    {
        key: 'size',
        label: 'Size'
    },
    {
        key: 'creationDate',
        label: 'CreationDate',
    }
]


const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await getS3BucketItems(page.value,
        limit.value, bucket.value.name, bucket.value.accountId, perfix.value)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    bucketItems.value = data ?? []
}

watchEffect(async () => fetchData())

const updatePage = (n: number) => {
    page.value = n
}

const changePagesize = (n: number) => {
    limit.value = n
}

const showS2Resource = async (r: S3BucketItem) => {

    if (r.isDirectory) {
        itemPerfix.value.push(r.key)
        perfix.value = r.key
    } else {
        const { data, error } = await getS3ItemUrl(bucket.value.name, bucket.value.accountId, r.key)
        window.open(data.url, '_blank')
    }
}

</script>

<template>
    <div class="full-content">
        <div class="head-content">
            <div class="">
                <h4>{{ itemPerfix.join(" > ") }}</h4>
            </div>
        </div>
        <TableAndPaging :items="bucketItems" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <template v-slot:body_key="body">
                <span className="detail-link" @click="showS2Resource(body)">
                    {{ body.key }}
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

.head-content h4 {
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