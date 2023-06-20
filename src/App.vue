<template>
  <div id=vue3-app>
    <img alt="Vue logo" src="./assets/logo.png" style="width: 20px;">
    <div id='public-links' @click="onRouteChange" style="margin-bottom: 20px">
      <router-link to="/" page-path=''>Home</router-link> |
      <router-link to="/base" page-path=''>Base</router-link> |
      <router-link to="/form" page-path=''>Form</router-link> |
      <router-link to="/dynamic" page-path=''>Dynamic</router-link> |
      <router-link to="/built-ins" page-path=''>built-ins</router-link>
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
