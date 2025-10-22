<script setup lang="ts">

import { ref } from 'vue'
import SearchBox from '@/common/SearchBox.vue'

interface Project {
    name: string
    progress: number
    color: string
    subs?: Project[]
}

// TODO: get data from server.
const projects = ref<Project[]>([
    {
        name: 'AWS',
        progress: 75,
        color: 'blue lighten-2',
        subs: [
            { name: 'account', progress: 80, color: 'green' },
            { name: 'ecs', progress: 60, color: 'orange' },
            { name: 'parameter', progress: 90, color: 'green' },
            { name: 's3', progress: 70, color: 'yellow' },
        ],
    },
    {
        name: 'Infr-project',
        progress: 50,
        color: 'purple lighten-2',
        subs: [
            { name: 'project', progress: 50, color: 'orange' },
            { name: 'platform', progress: 60, color: 'orange' },
            { name: 'resource', progress: 40, color: 'red' },
            { name: 'vault', progress: 50, color: 'orange' },
        ],
    },
    {
        name: 'Tools',
        progress: 65,
        color: 'teal lighten-2',
        subs: [
            { name: 'translate', progress: 60, color: 'orange' },
            { name: 'drawio', progress: 70, color: 'yellow' },
            { name: 'ocr', progress: 65, color: 'yellow' },
            { name: 'pdf', progress: 80, color: 'yellow' },
            { name: 'gitalk', progress: 90, color: 'green' },
        ],
    },
])

</script>

<template>
    <v-sheet>
        <v-container class="pa-4">
            <v-row>
                <v-col v-for="project in projects" :key="project.name" cols="12" sm="6" md="4">
                    <v-card elevation="6" class="pa-4 h-100" v-ripple>
                        <template v-slot:title> {{ project.name }} </template>
                        <template v-slot:append>
                            <v-progress-circular :model-value="project.progress" :size="100" :width="15"
                                :color="project.color">
                                <strong>{{ Math.ceil(project.progress) }}%</strong>
                            </v-progress-circular>
                        </template>

                        <v-card-subtitle class="mt-2">
                            Overall progress
                            <v-progress-linear striped :model-value="project.progress" :color="project.color"
                                height="20" rounded>
                                <strong>{{ Math.ceil(project.progress) }}%</strong>
                            </v-progress-linear>
                        </v-card-subtitle>

                        <v-divider class="my-3"></v-divider>

                        <v-list>
                            <v-list-item v-for="sub in project.subs" :key="sub.name">
                                <v-list-item-title class="text-capitalize"><strong>{{ sub.name }}</strong></v-list-item-title>
                                <v-progress-linear striped :model-value="sub.progress" :color="sub.color" height="18"
                                    rounded>
                                    <strong>{{ Math.ceil(sub.progress) }}%</strong>
                                </v-progress-linear>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <SearchBox></SearchBox>
    </v-sheet>
</template>

<style scoped></style>
