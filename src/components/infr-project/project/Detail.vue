<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import Spinners from '@/common/Spinners.vue'
import { useAuth } from '@/plugins/auth'

import { useProject } from './projectQuery'

const authService = useAuth()

const route = useRoute()

const projectId = (route.params.id ?? "") as string
const { isPending: isLoading, data: project } = useProject(projectId)

onUnmounted(() => {

})

onMounted(() => {
})

</script>

<template>
  <v-sheet class="d-flex flex-column ga-3" height="100%">
    <Spinners v-if="isLoading"></Spinners>
    <v-card class="pa-4" elevation="4" v-if="project">
      <v-card-title>
        <v-icon icon="md:lightbulb" class="mr-2"> </v-icon>
        {{ project.name }}
      </v-card-title>

      <v-card-subtitle class="mb-2">{{ project.description }}</v-card-subtitle>

      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="6">
            <strong>State:</strong> {{ project.state }}
          </v-col>
          <v-col cols="12" md="6">
            <strong>Start and end time:</strong>
            {{ project.start_time }} ~ {{ project.end_time }}
          </v-col>

          <v-col cols="12">
            <strong>Platforms:</strong>
            <v-row dense>
              <v-col v-for="(platform, index) in project.platforms" :key="'platform-' + index" cols="12" md="6">
                <v-card outlined class="pa-2">
                  <v-list-item>
                    <v-list-item-title>{{ platform.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ platform.description }}</v-list-item-subtitle>
                  </v-list-item>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <strong>Designs:</strong>
            <v-row dense>
              <v-col v-for="(design, index) in project.designs" :key="'design-' + index" cols="12" md="6">
                <v-card outlined class="pa-2">
                  <v-list-item>
                    <v-list-item-title>{{ design.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ design.description }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-divider class="my-2" />

                  <v-list dense>
                    <v-list-item v-for="(res, rIndex) in design.resources" :key="'res-' + rIndex">
                      <template v-slot:prepend>
                        <v-icon icon="md:docs" v-if="res.type === 'doc'"></v-icon>
                        <v-icon icon="md:image" v-else> </v-icon>
                      </template>

                      <v-list-item-title>{{ res.name }}</v-list-item-title>
                      <v-list-item-subtitle v-if="res.description">{{ res.description }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <strong>Tags:</strong>
            <v-chip-group class="mt-1" column>
              <v-chip v-for="(tag, index) in project.tags" :key="'tag-' + index" color="deep-purple lighten-4"
                class="ma-1" label>
                {{ tag }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>
