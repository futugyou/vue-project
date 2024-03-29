<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue'

import TableAndPaging, { TableField } from '@/common/TableAndPaging.vue'
import BreadcrumbGroup, { BreadcrumbItem } from '@/common/BreadcrumbGroup.vue'
import Button from '@/common/Button.vue'
import OpenIcon from '@/icons/Open.vue'
import ReloadIcon from '@/icons/Reload.vue'

import { S3Bucket, S3BucketItem, getS3BucketItems, getS3ItemUrl } from './s3bucket'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'

const props = defineProps<{
    s3Bucket: S3Bucket
}>()


const bucket = computed(() => {
    return props.s3Bucket
})

const itemPerfix = ref<BreadcrumbItem[]>([{ key: "", text: "S3 buckets" }])
const perfix = ref<string>()

const store = useMessageStore()
const { msg } = storeToRefs(store)

const bucketItems = ref<S3BucketItem[]>([])

const isLoading = ref(true)
const isSubLoading = ref(false)

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
    },
    {
        key: 'operation',
        label: 'Operation'
    }
]

const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await getS3BucketItems(page.value,
        limit.value, bucket.value.name, bucket.value.accountId, perfix.value ?? "")

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

const crumbItems = computed(() => {
    return itemPerfix.value
})

const changePagesize = (n: number) => {
    limit.value = n
}

const getBreadcrumbText = (key: string) => {
    const s = key.match(/[^/ ]+/g)
    if (s == null || s.length < 1) {
        return ""
    }

    return s[s.length - 1]
}

const showSubResource = async (r: S3BucketItem) => {
    if (r.isDirectory) {
        const bitem: BreadcrumbItem = {
            key: r.key,
            text: getBreadcrumbText(r.key)
        }
        itemPerfix.value.push(bitem)
        perfix.value = r.key
    }
}

const openFile = async (r: S3BucketItem) => {
    if (!r.isDirectory) {
        isSubLoading.value = true
        const { data, error } = await getS3ItemUrl(bucket.value.name, bucket.value.accountId, r.key)
        isSubLoading.value = false
        if (error) {
            msg.value = {
                errorMessages: [error.message],
                delay: 3000,
            }
            return
        }

        window.open(data.url, '_blank')
    }
}

const handleBreadcrumbClick = (key: string) => {
    let tmp: BreadcrumbItem[] = []
    for (let index = 0; index < itemPerfix.value.length; index++) {
        const element = itemPerfix.value[index]
        tmp.push(element)
        if (element.key == key) {
            break
        }
    }
    if (tmp.length == 0) {
        tmp.push({ key: "", text: "S3 buckets" })
    }
    itemPerfix.value = tmp
    perfix.value = key
}

</script>

<template>
    <!-- <Spinners v-if="isSubLoading"></Spinners> -->
    <div class="full-content">
        <div class="head-content">
            <BreadcrumbGroup :items="crumbItems" :action="handleBreadcrumbClick"></BreadcrumbGroup>
        </div>
        <div class="head-content2">
            <div class="bucketItemCount">Objects ({{ bucketItems.length }}) </div>
            <div class="bucketItemReload">
                <Button @click="fetchData()" :IsLoading="isLoading">
                    <ReloadIcon></ReloadIcon>
                </Button>
            </div>
        </div>
        <TableAndPaging :items="bucketItems" :fields="fields" :isLoading="isLoading" :canChangePageSize=(false)
            :pagesize=(100) @changePagesize="changePagesize">
            <template v-slot:body_key="body">
                <span className="detail-label" v-if="!body.isDirectory">
                    {{ body.key }}
                </span>
                <span className="detail-link" @click="showSubResource(body)" v-if="body.isDirectory">
                    {{ body.key }}
                </span>
            </template>
            <template v-slot:body_operation="body">
                <div v-if="!body.isDirectory">
                    <Button Text="view" @click="openFile(body)" :IsLoading="isSubLoading">
                        <OpenIcon></OpenIcon>
                    </Button>
                </div>
            </template>
        </TableAndPaging>
    </div>
</template>

<style scoped>
.head-content2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 40px;
}

.bucketItemCount {
    font-size: 18px;
    font-weight: 700;
}

.bucketItemReload {
    font-size: 16px;
    font-weight: 600;
}

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
    justify-content: flex-start;
    line-height: 40px;
}

.head-content h4 {
    margin: 0;
}

.detail-label {
    width: 100%;
    height: 100%;
    display: block;
    color: var(--vt-c-black);
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
