<script setup lang="ts">
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
    <router-link to="/" page-path="">Home</router-link> |
    <router-link to="/base" page-path="">Base</router-link> |
    <router-link to="/form" page-path="">Form</router-link> |
    <router-link to="/dynamic" page-path="">Dynamic</router-link> |
    <router-link to="/built-ins" page-path="">Built-ins</router-link> |
    <router-link to="/reactivity" page-path="">Reactivity</router-link> |
    <router-link to="/route" page-path="">Route</router-link> |
    <router-link to="/pinia" page-path="">Pinia</router-link>
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
