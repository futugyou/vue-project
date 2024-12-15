<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute, } from 'vue-router'
import { storeToRefs } from 'pinia'
import _ from 'lodash-es'

import Spinners from '@/common/Spinners.vue'
import Empty from '@/common/EmptyStates.vue'
import { useMessageStore } from '@/stores/message'
import { useAuth } from '@/plugins/auth'

import { PlatformApiFactory, PlatformDetailView, PlatformProject } from './platform'
import PlatformProjectVue from './PlatformProject.vue'
import VuetifyModal from '@/common/VuetifyModal.vue'
import Basic from './Basic.vue'
import PlatformProjectList from './PlatformProjectList.vue'

const store = useMessageStore()
const { msg } = storeToRefs(store)
const authService = useAuth()

const route = useRoute()

const isLoading = ref(true)
const platformId = route.params.id as string
const detail = ref<PlatformDetailView>()
let rawPlatformDetailViewData: PlatformDetailView | undefined
const project = ref<PlatformProject>()
const dialog = ref(false)

const tab = ref("one")

const sortedPlatformDetailView = (data: PlatformDetailView | undefined) => {
    if (data == undefined) {
        return undefined
    }

    return { ...data, projects: _.orderBy(data.projects, 'id', 'asc') }
}

const fetchData = async () => {
    isLoading.value = true
    const { data, error } = await PlatformApiFactory().v1PlatformIdGet(platformId)
    isLoading.value = false
    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }

        return
    }

    const sortData = sortedPlatformDetailView(data)
    detail.value = sortData
    rawPlatformDetailViewData = sortData
}

fetchData()

const changeTab = (t: string) => {
    tab.value = t
    project.value = undefined
}

const showProject = (pro: PlatformProject) => {
    tab.value = "three"
    project.value = pro
}

const platformChangeCanceled = () => {
    detail.value = rawPlatformDetailViewData
    dialog.value = false
}

const platformChanged = (view: PlatformDetailView) => {
    const sortData = sortedPlatformDetailView(view)
    detail.value = sortData
    rawPlatformDetailViewData = sortData

    dialog.value = false

    const value = project.value
    // handle project delete
    if (value == undefined || view.projects == undefined
        || view.projects.find(p => p.id == value.id) == undefined) {
        project.value = undefined
        tab.value = "one"
        return
    }
    // handle project webhook update
    if (value && view.projects) {
        const pro = view.projects.find(p => p.id == value.id)
        if (pro) {
            project.value = pro
            tab.value = "three"
        }
    }
}

const selfProjects = computed(() =>
    detail.value?.projects.filter(p => p.provider_project_id == "" || p.followed) ?? []
)

const providerProjects = computed(() =>
    detail.value?.projects.filter(p => p.provider_project_id != "" && !p.followed) ?? []
)

const disabled = computed(() =>
    detail.value?.is_deleted || !logined.value
)

const logined = computed(() =>
    authService.isAuthenticated()
)

</script>

<template>
    <v-sheet class="d-flex" height="100%">
        <Spinners v-if="isLoading"></Spinners>

        <v-sheet class="d-flex flex-column justify-space-between border-thin" v-if="!isLoading" width="200">
            <v-list density="compact" open-strategy="multiple" nav :lines="false" data-v-menu>
                <v-list-item slim color="primary" title="Platfrom" @click="changeTab('one')" :active="tab == 'one'">
                    <template v-slot:prepend>
                        <v-icon icon="md:analytics"></v-icon>
                    </template>
                </v-list-item>
            </v-list>
            <v-list density="compact" open-strategy="multiple" nav :lines="false" data-v-menu>
                <v-list-item slim color="primary" title="Projects" @click="changeTab('two')" :active="tab == 'two'">
                    <template v-slot:prepend>
                        <v-icon icon="md:view_kanban"></v-icon>
                    </template>
                </v-list-item>
            </v-list>
            <v-list density="compact" class="flex-fill" open-strategy="multiple" nav :lines="false" data-v-menu>
                <v-list-item slim v-for="(pro, i) in selfProjects" :key="i" :value="pro" color="primary"
                    @click="showProject(pro)" v-if="detail" :active="tab == 'three' && (project && pro.id == project.id)">
                    <v-list-item-title>
                        <span class="pl-5 text-subtitle-2">{{ pro.name }} </span>
                    </v-list-item-title>
                </v-list-item>
            </v-list>
            <div class="pa-2 d-flex justify-center" v-if="logined && detail">
                <VuetifyModal v-model:dialog="dialog" text="Add Project" :width="700" title="Add Project" hideFooter
                    :disabled="disabled">
                    <PlatformProjectVue :platform-id="detail.id" @cancel="platformChangeCanceled" @save="platformChanged"
                        :disabled="disabled">
                    </PlatformProjectVue>
                </VuetifyModal>
            </div>
        </v-sheet>

        <v-tabs-window v-model="tab" v-if="!isLoading" grow>
            <v-tabs-window-item value="one" v-if="detail">
                <Basic :model="detail" @cancel="platformChangeCanceled" @save="platformChanged"></Basic>
            </v-tabs-window-item>

            <v-tabs-window-item class="pa-4 h-100 overflow-y-auto" value="two" v-if="detail && detail.projects">
                <PlatformProjectList :model-value="detail.projects" :disabled="disabled"></PlatformProjectList>
            </v-tabs-window-item>

            <v-tabs-window-item value="three" v-if="project && detail" class="pa-3">
                <PlatformProjectVue :platform-id="detail.id" :project-id="project.id" :model="project"
                    @cancel="platformChangeCanceled" @save="platformChanged" :disabled="disabled">
                </PlatformProjectVue>
            </v-tabs-window-item>
        </v-tabs-window>
    </v-sheet>
</template>

<style scoped>
.v-window,
.v-window-item {
    width: 100%;
    height: 100%;
}

.v-list[data-v-menu] .v-list-group__items .v-list-item {
    padding-inline-start: var(--parent-padding) !important;
}

tr>td {
    vertical-align: middle;
}
</style>
