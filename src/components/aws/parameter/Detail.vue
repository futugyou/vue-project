<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Spinners from '@/common/Spinners.vue'
import VuetifyModal from '@/common/VuetifyModal.vue'
import TableAndPaging from '@/common/TableAndPaging.vue'
import type { TableField } from '@/common/TableAndPaging.vue'
import { getParameter, syncParameter } from './parameter'
import type { SyncParameter } from './parameter'
import { timeFormat } from '@/tools/timeFormat'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const parameterId = route.params.parameterId as string
const parameter = ref()
const awsparameter = ref()
const historys = ref<any[]>([])
const tab = ref()
const dialog = ref(false)

const checkedParameters = ref<string[]>([])
const compareParameters = ref<string[]>([])

const fields: TableField[] = [
    {
        key: 'key',
        label: 'Name',
        header: true
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

const displaySync = computed(() => {
    if (parameter.value
        && awsparameter.value
        && parameter.value.version < awsparameter.value.version) {
        return false
    }

    return true
})

const fetchData = async () => {
    if (parameterId == undefined) {
        return
    }

    isLoading.value = true
    const { data, error } = await getParameter(parameterId)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }

        return
    }

    parameter.value = data
    awsparameter.value = data?.current
    historys.value = data?.history
}

fetchData()

const checkedParametersStatus = (id: string) => {
    if (checkedParameters.value.length >= 2 && checkedParameters.value.findIndex(i => i == id) == -1) {
        return true
    }

    return false
}

const compareParameter = () => {
    if (checkedParameters.value.length != 2) {
        return
    }

    compareParameters.value = []
    dialog.value = true
    let selectedValues: any[] = []
    historys.value.map(p => {
        if (checkedParameters.value.includes(p.id)) {
            selectedValues.push(p.value)
        }
    })
    compareParameters.value = selectedValues
}

const compareWithAWS = () => {
    if (checkedParameters.value.length != 1) {
        return
    }

    compareParameters.value = []
    dialog.value = true
    let awsstring: string = ''
    if (awsparameter.value) {
        awsstring = awsparameter.value.value
    }

    let selectedId = checkedParameters.value[0]
    let selectedValue = historys.value.find(p => p.id == selectedId).value
    compareParameters.value = [selectedValue, awsstring]
}

const syncFromAWS = async () => {
    isLoading.value = true
    const p: SyncParameter = {
        id: parameterId,
    }

    const { data, error } = await syncParameter(p)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }

        return
    }

    router.push('/parameter/' + parameterId)
}

</script>

<template>
    <v-sheet class="d-flex flex-column overflow-hidden position-relative" height="100%">
        <VuetifyModal text="Compare Parameter" title="Compare Parameter" activator="somme" hideFooter
            v-model:dialog="dialog">
            <code-diff v-if="compareParameters.length == 2" :old-string="compareParameters[0]"
                :new-string="compareParameters[1]" output-format="side-by-side" />
        </VuetifyModal>
        <Spinners v-if="isLoading"></Spinners>

        <div class="compare-container" v-if="!isLoading && parameter != undefined && tab == 'one'">
            <v-btn @click="syncFromAWS" :disabled="displaySync">
                SyncFromAWS
            </v-btn>
        </div>

        <div class="compare-container" v-if="historys != undefined && historys.length > 0 && tab == 'three'">
            <v-btn @click="compareWithAWS" :disabled="checkedParameters.length != 1">
                CompareWithAWS
            </v-btn>

            <v-btn @click="compareParameter" :disabled="checkedParameters.length != 2">
                Compare
            </v-btn>
        </div>

        <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4" v-if="!isLoading">
            <v-tab value="one" text="Latest"></v-tab>
            <v-tab value="two" text="AWS"></v-tab>
            <v-tab value="three" text="History"></v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab" v-if="!isLoading" grow>
            <v-tabs-window-item value="one" v-if="parameter != undefined">
                <v-list lines="two">
                    <v-list-item title="Name" :subtitle="parameter.key"></v-list-item>
                    <v-list-item title="Version" :subtitle="parameter.version"></v-list-item>
                    <v-list-item title="Value" :subtitle="parameter.value"></v-list-item>
                </v-list>
            </v-tabs-window-item>

            <v-tabs-window-item value="two" v-if="awsparameter != undefined">
                <v-list lines="two">
                    <v-list-item title="Name" :subtitle="awsparameter.key"></v-list-item>
                    <v-list-item title="Version" :subtitle="awsparameter.version"></v-list-item>
                    <v-list-item title="Value" :subtitle="awsparameter.value"></v-list-item>
                </v-list>
            </v-tabs-window-item>

            <v-tabs-window-item value="three" v-if="historys != undefined && historys.length > 0">
                <TableAndPaging :items="historys" :fields="fields" :isLoading="isLoading">
                    <template v-slot:header_id="header">
                        <span style="color: red">{{ header.label }}</span>
                    </template>
                    <template v-slot:body_operation="body">
                        <v-checkbox v-model="checkedParameters" :disabled="checkedParametersStatus(body.id)"
                            :value="body.id" :id="body.id" label="Choose"></v-checkbox>
                    </template>
                </TableAndPaging>
            </v-tabs-window-item>
        </v-tabs-window>
    </v-sheet>
</template>

<style scoped>
.compare-container {
    position: absolute;
    right: 50px;
    top: 10px;
    z-index: 2000;
}

.compare-container>* {
    margin-right: 10px;
}

.v-window,
.v-window-item {
    width: 100%;
    height: 100%;
}
</style>
