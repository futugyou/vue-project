<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import TableAndPaging, { TableField } from '@/common/TableAndPaging.vue'
import VuetifyModal from '@/common/VuetifyModal.vue'
import RegionList from "@/components/aws/region/list.vue"
import AccountList from "@/components/aws/account/list.vue"
import Spinners from '@/common/Spinners.vue'

import { Parameter, getParameters, getParameterCompare } from './parameter'
import { useTimeFormat } from '@/composables/timeFormat'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
import { Account, defaultAccount } from '@/components/aws/account/account'

const store = useMessageStore()
const { msg } = storeToRefs(store)

const router = useRouter()

const parameters = ref<Parameter[]>([])
const selectedRegion = ref<string>('')
const selectedAccount = ref<Account>(defaultAccount)

const searchKey = ref<string>('')
const defaultParameter = ref<Parameter>(JSON.parse(localStorage.getItem('defaultParameter') ?? '{}'))
const isLoading = ref(true)
const subLoading = ref(true)
const limit = ref(30)
const page = ref(1)
const editref = ref(null)
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


const handleKeyworkChange = (e: any) => {
    const k: string = e.target.value;
    searchKey.value = k
    checkedParameters.value = []
}

const changeAccount = (acc: Account) => {
    selectedAccount.value = acc
    checkedParameters.value = []
}

</script>

<template>
    <div class="Parameter-full-content">
        <VuetifyModal text="Compare Definitions" title="Compare Definitions" activator="somme" hideFooter
            v-model:dialog="dialog">
            <Spinners v-if="subLoading"></Spinners>
            <code-diff v-if="compareParameterDatas.length == 2 && subLoading == false"
                :old-string="compareParameterDatas[0].value" :new-string="compareParameterDatas[1].value"
                output-format="side-by-side" />
            <h2 v-if="compareParameterDatas.length != 2">no data found</h2>
        </VuetifyModal>
        <div class="head-content">
            <div class="">
                <h1>Parameter</h1>
            </div>
            <div class="search-contatiner">
                <div class="search-item-contatiner">
                    <div class="search-item-lable">
                        <label class="form-check-label" for="searchKey">
                            Key:
                        </label>
                    </div>
                    <div class="search-item-com">
                        <input id="searchKey" :value="searchKey" @change="handleKeyworkChange" />
                    </div>
                </div>
                <div class="search-item-contatiner">
                    <div class="search-item-lable">
                        <label class="form-check-label" for="region">
                            Account:
                        </label>
                    </div>
                    <div class="search-item-com">
                        <AccountList id="account" :selected="selectedAccount.id" @changeAccount="changeAccount">
                        </AccountList>
                    </div>
                </div>
                <div class="search-item-contatiner">
                    <div class="search-item-lable">
                        <label class="form-check-label" for="region">
                            Region:
                        </label>
                    </div>
                    <div class="search-item-com">
                        <RegionList id="region" :selected="selectedRegion" @changeRegion="changeRegion"></RegionList>
                    </div>
                </div>
            </div>

            <div class="">
                <v-btn variant="outlined" @click="compareParameter" :disabled="checkedParameters.length != 2">
                    Compare
                </v-btn>
            </div>
        </div>
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
                <div class="operation">

                    <v-checkbox v-model="checkedParameters" density="compact" color="red" hide-details
                        :disabled="checkedParametersStatus(body.id)" :value="body.id" :id="body.id"></v-checkbox>
                    <label class="form-check-label" :for="body.id">
                        Choose
                    </label>
                </div>
            </template>
        </TableAndPaging>
    </div>
</template>

<style scoped>
.Parameter-full-content {
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
    justify-content: space-between;
}

.detail-link {
    width: 100%;
    height: 100%;
    display: block;
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
    margin-right: 30px;
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

.operation {
    background-color: inherit;
    padding-left: 0px;
    display: flex;
    gap: 10px;
    align-items: center;
}
</style>
