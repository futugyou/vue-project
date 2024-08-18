<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Spinners from '@/common/Spinners.vue'
import VuetifyModal from '@/common/VuetifyModal.vue'
import { getParameter, SyncParameter, syncParameter } from './parameter'

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
const tabIndex = ref("1")
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

const changeTab = (index: string) => {
    tabIndex.value = index
}

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
    <div class="detail-full-content">
        <VuetifyModal text="Compare Parameter" title="Compare Parameter" activator="somme" hideFooter
            v-model:dialog="dialog">
            <code-diff v-if="compareParameters.length == 2" :old-string="compareParameters[0]"
                :new-string="compareParameters[1]" output-format="side-by-side" />
        </VuetifyModal>
        <Spinners v-if="isLoading"></Spinners>

        <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4" v-if="!isLoading">
            <v-tab value="one">Latest</v-tab>
            <v-tab value="two">AWS</v-tab>
            <v-tab value="three">History</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab" v-if="!isLoading" grow>
            <v-tabs-window-item value="one" v-if="parameter != undefined">
                <div class="detail-container">
                    <div class="compare-container">
                        <v-btn @click="syncFromAWS" :disabled="displaySync">
                            SyncFromAWS
                        </v-btn>
                    </div>
                    <div class="detail-item">
                        <div class="detail-item-lable">Name:</div>
                        <div class="detail-item-content"> {{ parameter.key }}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-item-lable">Version:</div>
                        <div class="detail-item-content"> {{ parameter.version }}</div>
                    </div>
                    <div class="detail-item-textarea">
                        <div class="detail-item-lable">Value:</div>
                        <div class="textarea-container">
                            <textarea class="form-control" id="exampleFormControlTextarea1" Disabled
                                :value="parameter.value"></textarea>
                        </div>
                    </div>
                </div>
            </v-tabs-window-item>

            <v-tabs-window-item value="two" v-if="awsparameter != undefined">
                <div class="detail-container">
                    <div class="detail-item">
                        <div class="detail-item-lable">Name:</div>
                        <div class="detail-item-content"> {{ awsparameter.key }}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-item-lable">Version:</div>
                        <div class="detail-item-content"> {{ awsparameter.version }}</div>
                    </div>
                    <div class="detail-item-textarea">
                        <div class="detail-item-lable">Value:</div>
                        <div class="textarea-container">
                            <textarea class="form-control" id="exampleFormControlTextarea1" Disabled
                                :value="awsparameter.value"></textarea>
                        </div>
                    </div>
                </div>
            </v-tabs-window-item>

            <v-tabs-window-item value="three" v-if="historys != undefined && historys.length > 0">
                <div class="detail-container">
                    <div class="compare-container">
                        <v-btn @click="compareWithAWS" :disabled="checkedParameters.length != 1">
                            CompareWithAWS
                        </v-btn>

                        <v-btn @click="compareParameter" :disabled="checkedParameters.length != 2">
                            Compare
                        </v-btn>
                    </div>
                    <div v-for="(item, idx) in historys" :key="idx" class="history-item">
                        <div class="detail-item">
                            <div class="detail-item-lable">Name:</div>
                            <div class="detail-item-content"> {{ item.key }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-item-lable">Version:</div>
                            <div class="detail-item-content"> {{ item.version }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-item-lable">Operate Time:</div>
                            <div class="detail-item-content"> {{ item.operateAt }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-item-lable">
                                <label class="form-check-label" :for="item.id">
                                    Choose:
                                </label>
                            </div>
                            <div class="detail-item-content">
                                <v-checkbox v-model="checkedParameters" density="compact" color="red" hide-details
                                    :disabled="checkedParametersStatus(item.id)" :value="item.id"
                                    :id="item.id"></v-checkbox>
                            </div>
                        </div>
                    </div>
                </div>
            </v-tabs-window-item>
        </v-tabs-window>
    </div>
</template>

<style scoped>
.detail-full-content {
    justify-content: normal;
}

.detail-container {
    padding: 20px
}

.detail-item {
    height: auto;
}

.detail-item-textarea {
    display: flex;
    flex: 1;
    flex-direction: column;
}

.textarea-container {
    flex: 1;
}

.textarea-container>textarea {
    height: 100%;
}

.detail-item-lable {
    margin-right: 10px;
}

.history-item {
    display: flex;
    flex-direction: row;
}

.history-item>.detail-item {
    margin-right: 20px;
}

.compare-container {
    position: fixed;
    right: 50px;
}

.compare-container>* {
    margin-right: 20px;
}

.v-window {
    width: 100%;
    height: 100%;
}
</style>
