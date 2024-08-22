<script lang="ts" setup>
import { ref, watchEffect } from 'vue'

import TableAndPaging, { TableField } from '@/common/TableAndPaging.vue'
import VuetifyModal from '@/common/VuetifyModal.vue'
import RegionList from "@/components/aws/region/list.vue"
import AccountList from "@/components/aws/account/list.vue"
import Spinners from '@/common/Spinners.vue'
import Empty from '@/common/EmptyStates.vue'

import { Parameter, getParameters, getParameterCompare } from './parameter'
import { useTimeFormat } from '@/composables/timeFormat'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
import { Account, defaultAccount } from '@/components/aws/account/account'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const parameters = ref<Parameter[]>([])
const selectedRegion = ref<string>('')
const selectedAccount = ref<Account>(defaultAccount)

const searchKey = ref<string>('')
const isLoading = ref(true)
const subLoading = ref(true)
const limit = ref(30)
const page = ref(1)
const dialog = ref(false)

const timeFormat = (timestamp: number): string => {
    return useTimeFormat(timestamp)
}

const fields: TableField[] = [
    {
        key: 'id',
        label: '#',
        header: true
    },
    {
        key: 'alias',
        label: 'AccountAlias'
    },
    {
        key: 'key',
        label: 'Key'
    },
    {
        key: 'region',
        label: 'Region'
    },
    {
        key: 'version',
        label: 'Version'
    },
    {
        key: 'operateAt',
        label: 'OperateAt',
        format: timeFormat
    },
    {
        key: 'operation',
        label: 'Operation'
    }
]

// max compare count is 2
const checkedParameters = ref<string[]>([])
const checkedParametersStatus = (id: string) => {
    if (checkedParameters.value.length >= 2 && checkedParameters.value.findIndex(i => i == id) == -1) {
        return true
    }

    return false
}

const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await getParameters(page.value, limit.value, selectedRegion.value, searchKey.value, selectedAccount.value.alias)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    parameters.value = data ?? []
    // // mock delay
    // await new Promise((resolve) => setTimeout(resolve, 5000)) 
}

watchEffect(async () => fetchData())

const updatePage = (n: number) => {
    page.value = n
    checkedParameters.value = []
}

const changePagesize = (n: number) => {
    limit.value = n
    checkedParameters.value = []
}

const compareParameterDatas = ref<any[]>([])
const compareParameter = async () => {
    if (checkedParameters.value.length != 2) {
        return
    }

    dialog.value = true
    subLoading.value = true
    compareParameterDatas.value = []
    const sourceid = checkedParameters.value[0]
    const destid = checkedParameters.value[1]
    const { data, error } = await getParameterCompare(sourceid, destid)
    subLoading.value = false

    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    compareParameterDatas.value = data
}

const changeRegion = (key: string) => {
    selectedRegion.value = key
    checkedParameters.value = []
}

const changeAccount = (acc: Account) => {
    selectedAccount.value = acc
    checkedParameters.value = []
}

</script>

<template>
    <v-sheet class="d-flex flex-column" height="100%">
        <v-toolbar color="blue-lighten-5">
            <v-toolbar-title>Parameter</v-toolbar-title>
            <v-spacer></v-spacer>
            <label class="text-subtitle-1 mr-2" for="searchKey">
                Key:
            </label>
            <v-text-field clearable variant="outlined" v-model="searchKey"></v-text-field>
            <v-spacer></v-spacer>
            <label class="text-subtitle-1 mr-2" for="account">
                Account:
            </label>
            <AccountList id="account" :selected="selectedAccount.id" @changeAccount="changeAccount">
            </AccountList>
            <v-spacer></v-spacer>
            <label class="text-subtitle-1 mr-2" for="region">
                Region:
            </label>
            <RegionList id="region" :selected="selectedRegion" @changeRegion="changeRegion"></RegionList>
            <v-spacer></v-spacer>
            <v-btn @click="compareParameter" variant="outlined" :disabled="checkedParameters.length != 2">
                Compare
            </v-btn>
        </v-toolbar>
        <VuetifyModal text="Compare Definitions" title="Compare Definitions" activator="somme" hideFooter
            v-model:dialog="dialog">
            <Spinners v-if="subLoading"></Spinners>
            <code-diff v-if="compareParameterDatas.length == 2 && subLoading == false"
                :old-string="compareParameterDatas[0].value" :new-string="compareParameterDatas[1].value"
                output-format="side-by-side" />
            <Empty v-if="!subLoading && compareParameterDatas.length != 2"></Empty>
        </VuetifyModal>
        <TableAndPaging :items="parameters" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <template v-slot:header_id="header">
                <span style="color: red">{{ header.label }}</span>
            </template>
            <template v-slot:body_id="body">
                <router-link :to="'/parameter/' + body.id" page-path="" class="detail-link">
                    <span>
                        {{ body.id }}
                    </span>
                </router-link>
            </template>
            <template v-slot:body_operation="body">
                <v-checkbox v-model="checkedParameters" :disabled="checkedParametersStatus(body.id)" :value="body.id"
                    :id="body.id" label="Choose"></v-checkbox>
            </template>
        </TableAndPaging>
    </v-sheet>
</template>
