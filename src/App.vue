<script setup lang="ts">
import { ref, shallowRef, watchEffect } from 'vue'
import DemoRoute from './components/vuedemo/DemoRoute.vue'
import AwsRoute from './components/aws/AwsRoute.vue'
import TabContainer from './components/TabContainer.vue'
import Alert from '@/components/Alert.vue'
import SidebarMenu from '@/components/SidebarMenu.vue'

import { handleGlobalData } from '@/tools/baseAppEvent'
const rootContainer = ref("nomalRootContainer")
const onRouteChange = () => {
    handleGlobalData()
}

watchEffect(() => {
    if (!window.__MICRO_APP_ENVIRONMENT__) {
        rootContainer.value = "subAppRootContainer"
    } else {
        rootContainer.value = "nomalRootContainer"
    }
})

const components = shallowRef([AwsRoute, DemoRoute] as unknown as [])
</script>

<template>
    <Alert></Alert>
    <div :class="rootContainer">
        <div id="public-links" @click="onRouteChange">
            <KeepAlive>
                <TabContainer :components="components" v-if="rootContainer == 'nomalRootContainer'"> </TabContainer>
                
            </KeepAlive>
            <SidebarMenu class="subappsidebar" v-if="rootContainer == 'subAppRootContainer'" />
        </div>
        <div class="vu3-app">
            <router-view v-slot="{ Component, route }">
                <!-- 使用任何自定义过渡和回退到 `fade` -->
                <transition :name="route.meta.transition as string || 'fade'">
                    <KeepAlive>
                        <component :is="Component" :key="route.path" />
                    </KeepAlive>
                </transition>
            </router-view>
        </div>
    </div>
</template>

<style scoped>
#public-links {
    padding: 10px 0;
    font-size: 18px;
}

.vu3-app {
    flex-grow: 1;
    height: 100%;
    width: 100%;
    overflow-y: auto;
}

.subappsidebar {
    grid-area: 'sidebar';
}

.nomalRootContainer {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}

.subAppRootContainer {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
}
</style>
