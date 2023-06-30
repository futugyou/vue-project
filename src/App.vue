<script setup lang="ts">
import DemoRoute from './components/vuedemo/DemoRoute.vue'
import AwsRoute from './components/aws/AwsRoute.vue'

const onRouteChange = () => {
  if (window.__MICRO_APP_ENVIRONMENT__) {
    window.microApp.setGlobalData({ name: window.__MICRO_APP_NAME__ })
  }
}
</script>

<template>
  <div class="vue-logo">
    <img alt="Vue logo" src="./assets/logo.svg" />
  </div>

  <div id="public-links" @click="onRouteChange">
    <AwsRoute></AwsRoute>
    <DemoRoute></DemoRoute>
  </div>
  <div class="vu3-app">
    <router-view v-slot="{ Component, route }">
      <!-- 使用任何自定义过渡和回退到 `fade` -->
      <transition :name="route.meta.transition as string || 'fade'">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped></style>
