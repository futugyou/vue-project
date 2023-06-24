<script lang="ts" setup>
import { reactive, ref, computed, onMounted, watch, watchEffect, provide, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

</script>

<template>
    <div class="vueapp-container">
        <div class="vueapp-layer">
            <div class="route-gip">
                <router-link to="/route" page-path=''>Route: /route</router-link>
            </div>
            <div class="route-gip">
                <router-link to="/route/" page-path=''>Route: /route/</router-link>
            </div>
            <div class="route-gip">
                <router-link to="/route/a/" page-path=''>Route: /route/a/</router-link>
            </div>
            <div class="route-gip">
                <router-link to="/route/a/b" page-path=''>Route: /route/a/b</router-link>
            </div>
            <div class="route-gip">
                <router-link to="/route?food=eat" page-path=''>Route: /route?food=eat</router-link>
            </div>
        </div>
        <div class="vueapp-layer">
            <h1>route data</h1>
            <code><pre>{{ route }}</pre></code>
        </div>
        <div class="vueapp-layer">
            <h1>create route path</h1>
            <code><pre>{{ router.resolve({ name: 'Route', path: '/route/:username*' }).href }}</pre></code>
            <code><pre>{{ router.resolve({ name: 'Route', path: '/route/:username*', params: { username: ['a'] } }).href }}</pre></code>
            <code><pre>{{ router.resolve({ name: 'Route', path: '/route/:username*', params: { username: ['a', 'b', 'c'] } }).href }}</pre></code>
            <code><pre>{{ router.resolve({ name: 'Route', path: '/route/:username*', params: { username: ['a', 'b', 'c'] } , query: { game: ['d','e'] } }).href }}</pre></code>
        </div>
    </div>
</template>

<style>
.route-gip {
    margin-bottom: 5px;
    font-size: 16px;
}
</style>