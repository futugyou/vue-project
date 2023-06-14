<template>
  <div id=vue3-app>
    <img alt="Vue logo" src="./assets/logo.png">
    <div id='public-links' @click="onRouteChange">
      <router-link to="/" page-path=''>Home</router-link> |
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
