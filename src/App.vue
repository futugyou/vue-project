<template>
  <div class="vue-logo">
    <img alt="Vue logo" src="./assets/logo.png" />
  </div>

  <div id='public-links' @click="onRouteChange">
    <router-link to="/" page-path=''>Home</router-link> |
    <router-link to="/base" page-path=''>Base</router-link> |
    <router-link to="/form" page-path=''>Form</router-link> |
    <router-link to="/dynamic" page-path=''>Dynamic</router-link> |
    <router-link to="/built-ins" page-path=''>Built-ins</router-link> |
    <router-link to="/reactivity" page-path=''>Reactivity</router-link> |
    <router-link to="/route" page-path=''>Route</router-link>
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

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'vue3-app',
  methods: {
    onRouteChange() {
      if (window.__MICRO_APP_ENVIRONMENT__) {
        window.microApp.setGlobalData({ name: window.__MICRO_APP_NAME__ })
      }
    }
  }
});
</script>

<style>
html,
body {
  height: 100%;
  overflow-y: hidden;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#vu3-app-main {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.vue-logo img {
  width: 20px;
}

#public-links {
  margin-bottom: 20px
}

.vu3-app {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 20px;
}

.vueapp-container {
  grid-gap: 5px;
  display: grid;
  grid-template-columns: auto auto auto auto;
  justify-items: stretch;
  align-items: stretch;
}

.vueapp-layer {
  text-align: left;
  border: 1px solid #6acbe3;
  border-radius: 5px;
  padding: 20px;
  overflow: hidden;
  white-space: nowrap;
}
</style>
