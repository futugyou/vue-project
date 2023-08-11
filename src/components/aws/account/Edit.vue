<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { isEqual, join } from 'lodash-es'

import Spinners from '@/components/Spinners.vue'
import Alert from '@/components/Alert.vue'
import { useTimeFormat } from '@/composables/timeFormat'
import { Account, defaultAccount, checkAccount, editAccount, createAccount } from './account'
import { getRegions } from '@/tools/regions'

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

const errorMessages = ref([] as string[])

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
        errorMessages.value = message
        return
    }

    isLoading.value = true
    let newdata: Account
    if (props.account.id != '') {
        const { data, error } = await editAccount(account.value)
        newdata = data as Account
    } else {
        const { data, error } = await createAccount(account.value)
        newdata = data as Account
    }

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
        <Alert :errorMessages="errorMessages" :delay="3000" :key="join(errorMessages)"></Alert>
        <!-- <div v-if="errorMessages.length > 0">
            <div class="alert alert-danger check-message" role="alert" v-for="msg in errorMessages" :key="msg">
                {{ msg }}
            </div>
        </div> -->

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
</style>
