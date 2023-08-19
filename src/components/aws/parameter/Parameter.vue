<script lang="ts" setup>
import { ref, watchEffect, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { join } from 'lodash-es'

import TableAndPaging, { TableField } from '@/components/TableAndPaging.vue'

import { Parameter, getParameters, getParameterCompare } from './parameter'
import { useTimeFormat } from '@/composables/timeFormat'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const router = useRouter()

const Parameters = ref<Parameter[]>([])
const defaultParameter = ref<Parameter>(JSON.parse(localStorage.getItem('defaultParameter') ?? '{}'))
const isLoading = ref(true)
const limit = ref(10)
const page = ref(1)
const editref = ref(null)

const timeFormat = (timestamp: number): string => {
    return useTimeFormat(timestamp)
}

const fields: TableField[] = [
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
    const { data, error } = await getParameters(page.value, limit.value)
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    Parameters.value = data ?? []
    // // mock delay
    // await new Promise((resolve) => setTimeout(resolve, 5000))
    isLoading.value = false
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

const compareParameter = async () => {
    if (checkedParameters.value.length != 2) {
        return
    }

    const sourceid = checkedParameters.value[0]
    const destid = checkedParameters.value[1]
    const { data, error } = await getParameterCompare(sourceid, destid)
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    console.log(data)
}
</script>

<template>
    <div class="Parameter-full-content">
        <div class="head-content">
            <div class="">
                <h1>Parameter</h1>
            </div>
            <div class="">
                <button type="button" class="btn btn-warning" @click="compareParameter"
                    :disabled="checkedParameters.length != 2"> Compare
                </button>
            </div>
        </div>
        <TableAndPaging :items="Parameters" :fields="fields" :isLoading="isLoading" @changePagesize="changePagesize"
            @updatePage="updatePage">
            <!-- <template v-slot:header_id="header">
                <span style="color: red">{{ header.label }}</span>
            </template> -->
            <template v-slot:body_key="body">
                <router-link :to="'/parameter/' + body.id" page-path="" class="detail-link">
                    <span>
                        {{ body.key }}
                    </span>
                </router-link>
            </template>
            <template v-slot:body_operation="body">
                <input class="form-check-input gap-right-10" type="checkbox" :value="body.id" :id="body.id"
                    v-model="checkedParameters" :disabled="checkedParametersStatus(body.id)">
                <label class="form-check-label" :for="body.id">
                    Choose
                </label>
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
    margin-right: 10px;
}
</style>
