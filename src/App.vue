<script setup lang="ts">
import { ref, shallowRef, watchEffect } from 'vue'
import type { Component } from 'vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'

import TabContainer from '@/common/TabContainer.vue'
import Alert from '@/common/Alert.vue'
import SidebarMenu from '@/common/SidebarMenu.vue'

import IconECSService from '@/icons/ECSService.vue'
import IconSSM from '@/icons/SSM.vue'
import IconIAMUser from '@/icons/IAMUser.vue'
import IconS3Bucket from '@/icons/S3Bucket.vue'
import IconHome from '@/icons/Home.vue'
import IconPdf from '@/icons/Pdf.vue'
import IconOrc from '@/icons/Scan.vue'
import IconTranslate from '@/icons/Translate.vue'

import { handleGlobalData } from '@/tools/baseAppEvent'

import DemoRoute from '@/components/vuedemo/DemoRoute.vue'
import AwsRoute from '@/components/aws/AwsRoute.vue'
import ToolsRoute from '@/components/tools/ToolsRoute.vue'

const rootContainer = ref("nomalRootContainer")
const onRouteChange = () => {
    handleGlobalData()
}

const SidebarMenuItems = [{
    route: "/",
    label: "Home",
    icon: IconHome,
}, {
    route: "/pdf",
    label: "Pdf",
    icon: IconPdf,
}, {
    route: "/ocr",
    label: "Ocr",
    icon: IconOrc,
}, {
    route: "/translate",
    label: "Translate",
    icon: IconTranslate,
}, {
    route: "/account",
    label: "Account",
    icon: IconIAMUser,
}, {
    route: "/parameter",
    label: "Parameter",
    icon: IconSSM,
}, {
    route: "/ecs",
    label: "Ecs Service",
    icon: IconECSService,
}, {
    route: "/s3",
    label: "S3Bucket",
    icon: IconS3Bucket,
},
]

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
    'tools': ToolsRoute,
}

const components = shallowRef(componentDic)
</script>

<template>
    <SpeedInsights />
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
        </v-app-bar>

        <v-navigation-drawer :rail="true" v-if="rootContainer == 'subAppRootContainer'">
            <SidebarMenu class="subappsidebar" :items="SidebarMenuItems" />
        </v-navigation-drawer>

        <v-main class="vu3-app">
            <router-view v-slot="{ Component, route }">
                <!-- 使用任何自定义过渡和回退到 `fade` -->
                <transition :name="route.meta.transition as string || 'fade'">
                    <KeepAlive>
                        <component :is="Component" :key="route.path" />
                    </KeepAlive>
                </transition>
            </router-view>
        </v-main>
    </v-app>
</template>

<style scoped>
.subappsidebar {
    grid-area: 'sidebar';
}
</style>
