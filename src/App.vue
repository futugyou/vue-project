<script setup lang="ts">
import { ref, shallowRef, watchEffect, defineAsyncComponent } from 'vue'
import type { Component } from 'vue'

import TabContainer from '@/common/TabContainer.vue'
import Alert from '@/common/Alert.vue'
import SidenavForSubApp from '@/common/SidenavForSubApp.vue'
import User from "@/components/user/user.vue"

import { handleGlobalData } from '@/tools/baseAppEvent'

import DemoRoute from '@/components/vuedemo/DemoRoute.vue'
import AwsRoute from '@/components/aws/AwsRoute.vue'
import ToolsRoute from '@/components/tools/ToolsRoute.vue'
import ProjectRoute from '@/components/infr-project/ProjectRoute.vue'

let SpeedInsightsComponent = null
if (import.meta.env.PROD) {
    SpeedInsightsComponent = defineAsyncComponent(() =>
        import('@vercel/speed-insights/vue').then(m => m.SpeedInsights)
    )
}

const rootContainer = ref("nomalRootContainer")
const onRouteChange = () => {
    handleGlobalData()
}

watchEffect(() => {
    if (window.__MICRO_APP_ENVIRONMENT__) {
        rootContainer.value = "subAppRootContainer"
    } else {
        rootContainer.value = "nomalRootContainer"
    }
})

const componentDic: Record<string, Component> = {
    'demo': DemoRoute,
    'aws': AwsRoute,
    'project': ProjectRoute,
    'tools': ToolsRoute,
}

const components = shallowRef(componentDic)

const isSidebarOpen = shallowRef<Boolean>(false)

</script>

<template>
    <component :is="SpeedInsightsComponent" v-if="SpeedInsightsComponent" />
    <Alert></Alert>
    <v-app>
        <v-app-bar density="compact" :elevation="2" @click="onRouteChange" v-if="rootContainer == 'nomalRootContainer'">
            <template v-slot:prepend>
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
            </template>
            <v-app-bar-title>
                <KeepAlive>
                    <TabContainer :components="components">
                    </TabContainer>
                </KeepAlive>
            </v-app-bar-title>
            <User></User>
        </v-app-bar>
        <v-fab icon="$vuetify" variant="tonal" location="top start" position="fixed" app width="40" height="40"
            color="primary" @click="isSidebarOpen = !isSidebarOpen"
            v-if="rootContainer == 'subAppRootContainer'"></v-fab>
        <v-navigation-drawer expand-on-hover rail rail-width="64" width="12rem"
            v-if="rootContainer == 'subAppRootContainer' && isSidebarOpen">
            <SidenavForSubApp />
        </v-navigation-drawer>

        <v-main height="100%">
            <router-view v-slot="{ Component, route }">
                <transition :name="route.meta.transition as string || 'fade'">
                    <KeepAlive>
                        <component :is="Component" :key="route.path" />
                    </KeepAlive>
                </transition>
            </router-view>
        </v-main>
    </v-app>
</template>
