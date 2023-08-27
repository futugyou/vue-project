<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { isEqual, join } from 'lodash-es'

import Spinners from '@/components/Spinners.vue'
import RegionList from "@/components/aws/region/list.vue"
import { useTimeFormat } from '@/composables/timeFormat'
import { Account, defaultAccount, checkAccount, editAccount, createAccount } from './account'
import { getRegions } from '@/tools/regions'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const router = useRouter()

const props = withDefaults(
    defineProps<{
        account?: Account
    }>(),
    {
        account: () => {
            return { ...defaultAccount }
        }
    }
)

const emit = defineEmits<{
    (e: 'save'): void
    (e: 'close'): void
}>()

const isLoading = ref(false)
const orgAccount: Account = {
    ...props.account
}

const account = ref<Account>({ ...props.account })

const regionList = getRegions().map((item) => {
    return {
        key: item,
        value: item
    }
})

const changeRegion = (key: string) => {
    account.value.region = key
}

const save = async () => {
    const { successed, message } = checkAccount(account.value)
    if (!successed) {
        msg.value = {
            errorMessages: message,
            delay: 3000,
        }
        return
    }

    isLoading.value = true
    let newdata: Account
    let rdata: any
    let rerror: any
    if (props.account.id != '') {
        const { data, error } = await editAccount(account.value)
        rdata = data
        rerror = error
    } else {
        const { data = rdata, error = rerror } = await createAccount(account.value)
        rdata = data
        rerror = error
    }

    if (rerror) {
        msg.value = {
            errorMessages: [rerror.message],
            delay: 3000,
        }
        isLoading.value = false
        return
    }

    newdata = rdata as Account
    router.push('/account/' + newdata.id)
    isLoading.value = false
    emit('save')
    account.value = { ...defaultAccount }
}

const close = () => {
    if (isEqual(account.value, orgAccount)) {
        emit('close')
    } else {
        const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
        if (answer) {
            emit('close')
        }
    }

    account.value = { ...defaultAccount }
}

defineExpose({
    save,
    close
})
</script>

<template>
    <div class="detail-full-content">
        <Spinners v-if="isLoading"></Spinners>
        <div v-if="!isLoading" class="detail-container">
            <div class="detail-item" v-if="account?.id">
                <div class="detail-item-lable">ID</div>
                <div class="detail-item-content">{{ account?.id }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Region</div>
                <div class="detail-item-content">
                    <RegionList :selected="account.region" @changeRegion="changeRegion"></RegionList>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Alias</div>
                <div class="detail-item-content">
                    <input v-model="account.alias" />
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">AccessKeyId</div>
                <div class="detail-item-content">
                    <input v-model="account.accessKeyId" />
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">SecretAccessKey</div>
                <div class="detail-item-content">
                    <input v-model="account.secretAccessKey" />
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">CreatedAt</div>
                <div class="detail-item-content">
                    {{ account ? useTimeFormat(account.createdAt) : '' }}
                </div>
            </div>
            <div class="button-container">
                <button type="button" class="btn btn-secondary" @click="close">Close</button>
                <button type="button" class="btn btn-primary" @click="save">Save changes</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.detail-container {
    max-width: 600px;
    height: auto;
}

.detail-item-lable {
    flex: 1;
    padding: 5px;
    margin: 5px;
    background-color: #e2f7f0;
}

.detail-item-content {
    flex: 1;
    padding: 5px;
    margin: 5px;
    height: 40px;
}

.detail-item-content input,
.detail-item-content ul {
    width: 100%;
}

.button-container {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
}

.button-container>button {
    margin: 5px;
}

.alert-container {
    position: relative;
}
</style>
