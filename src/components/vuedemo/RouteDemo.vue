<script lang="ts" setup>
import { reactive, ref, computed, onMounted, watch, watchEffect, provide, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const demoroute1 = router.resolve({ name: 'Route', path: '/route/:username*' }).href
const demoroute2 = router.resolve({ name: 'Route', path: '/route/:username*', params: { username: ['a'] } }).href
const demoroute3 = router.resolve({ name: 'Route', path: '/route/:username*', params: { username: ['a', 'b', 'c'] } }).href
const demoroute4 = router.resolve({ name: 'Route', path: '/route/:username*', params: { username: ['a', 'b', 'c'] }, query: { game: ['d', 'e'] } }).href

const link = (r: string) => {
    router.push(r)
}

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
            <div class="route-gip">
                <button @click="link(demoroute1)">Link to route1</button>
                <code><pre>route1: {{ demoroute1 }}</pre></code>
            </div>
            <div class="route-gip">
                <button @click="link(demoroute2)">Link to route2</button>
                <code><pre>route2: {{ demoroute2 }}</pre></code>
            </div>
            <div class="route-gip">
                <button @click="link(demoroute3)">Link to route3</button>
                <code><pre>route3: {{ demoroute3 }}</pre></code>
            </div>
            <div class="route-gip">
                <button @click="link(demoroute4)">Link to route4</button>
                <code><pre>route4: {{ demoroute4 }}</pre></code>
            </div>
        </div>
    </div>
</template>

<style>
.route-gip {
    margin-bottom: 5px;
    font-size: 16px;
}
</style>