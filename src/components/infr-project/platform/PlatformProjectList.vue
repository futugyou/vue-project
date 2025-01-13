<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import _ from 'lodash-es'

import { useAuth } from '@/plugins/auth'

import { PlatformProject } from './platform'
import Empty from '@/common/EmptyStates.vue'

const authService = useAuth()

const props = defineProps<{
    projects: PlatformProject[],
    disabled?: boolean,
}>()

const selfProjects = computed(() =>
    props.projects.filter(p => p.provider_project_id == "" || p.followed) ?? []
)

const providerProjects = computed(() =>
    props.projects.filter(p => p.provider_project_id != "" && !p.followed) ?? []
)

const disabled = computed(() => {
    if (props.disabled == true) {
        return true
    }
    return !logined.value
})

const logined = computed(() =>
    authService.isAuthenticated()
)

const emit = defineEmits<{
    (e: 'follow', project: PlatformProject): void
}>()

const HandleFollow = (project: PlatformProject) => {
    emit('follow', project)
}

</script>

<template>
    <v-sheet>
        <Empty v-if="projects!.length == 0"></Empty>
        <v-sheet v-for="projects, i in [selfProjects, providerProjects]" :key="i" class="mx-auto px-3 ma-6" elevation="10"
            rounded>
            <v-row class="elevation-1">
                <v-col cols="12" class="pa-3">
                    <span class="text-h5 pl-3">
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
                    <v-card class="d-flex flex-column pa-2" hover>
                        <template v-slot:title>{{ project.name }} </template>
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

                        <span class="text-subtitle-1 pl-4" v-if="project.properties.length > 0">Property</span>
                        <v-table density="compact">
                            <tbody>
                                <tr v-for="(value, key) in project.properties" :key="value.key">
                                    <td class="">{{ value.key }}</td>
                                    <td>{{ value.value }}</td>
                                </tr>
                            </tbody>
                        </v-table>

                        <v-sheet v-if="logined && i == 1">
                            <v-btn variant="tonal" :disabled="disabled" @click="HandleFollow(project)">
                                {{ project.followed ? "unfollow" : "follow" }}
                            </v-btn>
                        </v-sheet>
                    </v-card>
                </v-col>
            </v-row>
        </v-sheet>
    </v-sheet>
</template>

<style scoped>
tr>td {
    vertical-align: middle;
}
</style>
