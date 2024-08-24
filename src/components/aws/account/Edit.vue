<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { isEqual } from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
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
let orgAccount: Account = {
    ...props.account
}

const account = ref<Account>({ ...props.account })

watchEffect(() => {
    let a = props.account
    if (a.id == "") {
        a.createdAt = new Date().getTime()
    }
    account.value = a
    orgAccount = a
})

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

    isLoading.value = false

    if (rerror) {
        msg.value = {
            errorMessages: [rerror.message],
            delay: 3000,
        }
        return
    }

    newdata = rdata as Account
    router.push('/account/' + newdata.id)
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
    <v-sheet class="d-flex flex-column align-center" height="100%">
        <Spinners v-if="isLoading"></Spinners>
        <v-card title="Account Information" v-if="!isLoading" class="d-flex flex-column align-center">
            <v-card-text class="d-flex flex-column text-body-1 ga-4 pa-4">
                <v-sheet v-if="account.id">
                    <div class="font-weight-bold flex-1-1 pa-1">ID</div>
                    <div class="pa-1 flex-1-1">{{ account.id }}</div>
                </v-sheet>
                <v-sheet>
                    <div class="font-weight-bold flex-1-1 pa-1">Region</div>
                    <div class="pa-1 flex-1-1">
                        <RegionList :selected="account.region" @changeRegion="changeRegion"></RegionList>
                    </div>
                </v-sheet>
                <v-sheet>
                    <div class="font-weight-bold flex-1-1 pa-1">Alias</div>
                    <div class="pa-1 flex-1-1">
                        <v-text-field v-model="account.alias"></v-text-field>
                    </div>
                </v-sheet>
                <v-sheet>
                    <div class="font-weight-bold flex-1-1 pa-1">AccessKeyId</div>
                    <div class="pa-1 flex-1-1">
                        <v-text-field v-model="account.accessKeyId"></v-text-field>
                    </div>
                </v-sheet>
                <v-sheet>
                    <div class="font-weight-bold flex-1-1 pa-1">SecretAccessKey</div>
                    <div class="pa-1 flex-1-1">
                        <v-text-field v-model="account.secretAccessKey" width="500"></v-text-field>
                    </div>
                </v-sheet>
                <v-sheet>
                    <div class="font-weight-bold flex-1-1 pa-1">CreatedAt</div>
                    <div class="pa-1 flex-1-1">
                        {{ useTimeFormat(account.createdAt) }}
                    </div>
                </v-sheet>
            </v-card-text>

            <v-card-actions>
                <v-btn color="primary" variant="outlined" @click="close">Close</v-btn>
                <v-btn color="secondary" variant="outlined" @click="save">Save changes</v-btn>
            </v-card-actions>
        </v-card>
    </v-sheet>
</template>
