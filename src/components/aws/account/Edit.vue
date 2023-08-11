<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { isEqual, join } from 'lodash-es'

import Spinners from '@/components/Spinners.vue' 
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
    <div class="edit-full-content">
        <Spinners v-if="isLoading"></Spinners>
        <div v-if="!isLoading" class="detail-container">
            <div class="detail-item" v-if="account?.id">
                <div class="detail-item-lable">ID</div>
                <div class="detail-item-content">{{ account?.id }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Region</div>
                <div class="detail-item-content">
                    <!-- <input v-model="account.region" /> -->
                    <div class="dropdown-center" style="width: 100%;">
                        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false" data-bs-display="static" style="width: 100%;">
                            {{ account.region.length > 0 ? account.region : '--choose a region--' }}
                        </button>
                        <ul class="dropdown-menu">
                            <li v-for="item in regionList">
                                <a class="dropdown-item" href="#" @click="changeRegion(item.key)"
                                    :class="{ active: item.key == account.region }">
                                    {{ item.value }}
                                </a>
                            </li>
                        </ul>
                    </div>
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
.edit-full-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
}

.detail-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-align: left;
    max-width: 600px;
    width: 100%;
    font-size: 18px;
    background-color: aliceblue;
}

.detail-item {
    display: flex;
    flex-direction: row;
    height: 60px;
}

.detail-item-lable {
    flex: 1;
    display: flex;
    line-height: 18px;
    padding: 5px;
    margin: 5px;
    height: 40px;
    background-color: #e2f7f0;
    border-radius: 10px;
    align-content: center;
    flex-wrap: wrap;
}

.detail-item-content {
    flex: 1;
    display: flex;
    line-height: 18px;
    padding: 5px;
    margin: 5px;
    height: 40px;
    border-radius: 10px;
    align-content: center;
    flex-wrap: wrap;
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
