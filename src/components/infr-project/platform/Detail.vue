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

const store = useMessageStore()
const { msg } = storeToRefs(store)
const authService = useAuth()

const route = useRoute()

const isLoading = ref(true)
const listOpened = ref(["Projects"])
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
            <v-list density="compact" v-model:opened="listOpened" open-strategy="multiple" nav :lines="false" data-v-menu>
                <v-list-item slim color="primary" title="Base" @click="changeTab('one')" :active="tab == 'one'">
                    <template v-slot:prepend>
                        <v-icon icon="md:analytics"></v-icon>
                    </template>
                </v-list-item>
                <v-list-group value="Projects">
                    <template v-slot:activator="{ props }">
                        <v-list-item slim v-bind="props" title="Projects" @click="changeTab('two')">
                            <template v-slot:prepend>
                                <v-icon icon="md:view_kanban"></v-icon>
                            </template>
                        </v-list-item>
                    </template>
                    <v-list-item slim v-for="(pro, i) in selfProjects" :key="i" :value="pro" color="primary"
                        @click="showProject(pro)" v-if="detail"
                        :active="tab == 'three' && (project && pro.id == project.id)">
                        <v-list-item-title v-text="pro.name"></v-list-item-title>
                    </v-list-item>
                </v-list-group>
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
                <Empty v-if="detail.projects!.length == 0"></Empty>
                <v-sheet v-for="projects, i in [selfProjects, providerProjects]" :key="i" class="mx-auto px-3 ma-6"
                    elevation="10" rounded>
                    <v-row class="elevation-1">
                        <v-col cols="12" class="pa-3">
                            <span class="text-h4 pl-3">
                                {{ i == 0 ? "Self Projects" : "Provider Projects" }}
                            </span>
                        </v-col>
                    </v-row>

                    <v-row v-if="projects.length == 0" class="pa-5">
                        <v-col>
                            <span class="text-h6">
                                There is no data in the current category
                            </span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="pa-3" v-for="project in projects" :key="project.id" cols="12" md="4">
                            <v-card v-if="!isLoading" class="d-flex flex-column pa-2" hover>
                                <template v-slot:title>Name: {{ project.name }} </template>
                                <template v-slot:subtitle>ID: {{ project.id }} </template>

                                <template v-slot:append>
                                    <a :href="project.url" target="_blank">
                                        <v-hover>
                                            <template v-slot:default="{ props }">
                                                <v-icon icon="md:open_in_new" v-bind="props"></v-icon>
                                            </template>
                                        </v-hover>
                                    </a>
                                </template>

                                <v-list lines="one">
                                    <v-list-subheader>Property</v-list-subheader>
                                    <v-list-item v-for="(value, key) in project.properties" :key="value.key">
                                        <span class="text-subtitle-1 mr-1">key:</span>
                                        <span class="text-subtitle-2 mr-3">{{ value.key }}</span>
                                        <span class="text-subtitle-1 mr-1">value:</span>
                                        <span class="text-subtitle-2">{{ value.value }}</span>
                                    </v-list-item>
                                </v-list>
                                <v-sheet>
                                    <v-btn variant="tonal">
                                        {{ project.followed ? "Unlink" : "Link" }}
                                    </v-btn>
                                </v-sheet>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-sheet>

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
</style>
