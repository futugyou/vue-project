<script setup lang="ts">

import { shallowRef } from 'vue'
import { RouterLink } from 'vue-router'
import IconAngle from '@/icons/Angle.vue'
import IconECSService from '@/icons/ECSService.vue'
import IconSSM from '@/icons/SSM.vue'
import IconIAMUser from '@/icons/IAMUser.vue'
import IconS3Bucket from '@/icons/S3Bucket.vue'
import IconHome from '@/icons/Home.vue'
import IOther from '@/icons/Other.vue'

const isSidebarOpen = shallowRef<Boolean>(false)

function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
}

</script>

<template>
    <div class="wrapper">
        <aside :vue:is-open="isSidebarOpen">
            <ul class="sidebar-head">
                <li>
                    <img src="@/assets/logo.svg" alt="logo" width="32" height="32">
                </li>
                <li>
                    <button class="sidebar-toggle" :class="isSidebarOpen ? 'toggle-button' : ''">
                        <IconAngle @click="toggleSidebar" />
                    </button>
                </li>
            </ul>

            <h4 :transparent="!isSidebarOpen">Menu</h4>

            <ul>
                <li>
                    <router-link to="/">
                        <IconHome />
                        <Transition name="fade">
                            <span v-show="isSidebarOpen">Home</span>
                        </Transition>
                    </router-link>
                </li>
                <li>
                    <router-link to="/account">
                        <IconIAMUser />
                        <Transition name="fade">
                            <span v-show="isSidebarOpen">Account</span>
                        </Transition>
                    </router-link>
                </li>
                <li>
                    <router-link to="/parameter">
                        <IconSSM />
                        <Transition name="fade">
                            <span v-show="isSidebarOpen">Parameter</span>
                        </Transition>
                    </router-link>
                </li>
                <li>
                    <router-link to="/ecs">
                        <IconECSService />
                        <Transition name="fade">
                            <span v-show="isSidebarOpen">Ecs Service</span>
                        </Transition>
                    </router-link>
                </li>
                <li>
                    <router-link to="/s3">
                        <IconS3Bucket />
                        <Transition name="fade">
                            <span v-show="isSidebarOpen">S3Bucket</span>
                        </Transition>
                    </router-link>
                </li>
                <li>
                    <router-link to="/base">
                        <IOther />
                        <Transition name="fade">
                            <span v-show="isSidebarOpen">Base</span>
                        </Transition>
                    </router-link>
                </li>
                <li>
                    <router-link to="/form">
                        <IOther />
                        <Transition name="fade">
                            <span v-show="isSidebarOpen">Form</span>
                        </Transition>
                    </router-link>
                </li>
                <li>
                    <router-link to="/dynamic">
                        <IOther />
                        <Transition name="fade">
                            <span v-show="isSidebarOpen">Dynamic</span>
                        </Transition>
                    </router-link>
                </li>
                <li>
                    <router-link to="/built-ins">
                        <IOther />
                        <Transition name="fade">
                            <span v-show="isSidebarOpen">Built-ins</span>
                        </Transition>
                    </router-link>
                </li>
                <li>
                    <router-link to="/reactivity">
                        <IOther />
                        <Transition name="fade">
                            <span v-show="isSidebarOpen">Reactivity</span>
                        </Transition>
                    </router-link>
                </li>
                <li>
                    <router-link to="/route">
                        <IOther />
                        <Transition name="fade">
                            <span v-show="isSidebarOpen">Route</span>
                        </Transition>
                    </router-link>
                </li>
                <li>
                    <router-link to="/pinia">
                        <IOther />
                        <Transition name="fade">
                            <span v-show="isSidebarOpen">Pinia</span>
                        </Transition>
                    </router-link>
                </li>
            </ul>
        </aside>
    </div>
</template>

<style scoped lang="scss"> $primary-color: #ffa;
 $minor-color: #f5a;
 $sidebar-width: 4rem;
 $sidebar-width: 4rem;
 $toggle-duration: 300ms;
 $sidebar-padding-inline-start: 1rem;

 aside {
     color: $primary-color !important;
     background: #120;
     display: flex;
     flex-direction: column;
     min-height: 100vh;
     padding-block: 1rem;
     transition: all $toggle-duration;
     width: $sidebar-width;
 }

 aside[vue\:is-open=true] {
     width: 3 * $sidebar-width;
 }

 ul {
     display: flex;
     flex-direction: column;
     gap: 0.5rem;
     padding-block-end: 1rem;
     // list-style-type: none;
     padding-left: 0rem;
 }

 img {
     object-fit: contain;
 }

 li {
     text-align: left;
     min-width: fit-content;
     cursor: pointer;
     padding-inline-start: $sidebar-padding-inline-start;

     &:hover {
         color: $minor-color;
         background-color: lighten($color: #120, $amount: 5);
     }

     & a {
         // border-right: 0.25rem solid white;
         display: flex;
         color: $primary-color;
         align-items: center;
         column-gap: 0.75rem;
         position: relative;
         padding-block: 0.5rem;
     }

     & a:hover {
         background-color: transparent;
     }

     a.router-link-exact-active::after {
         content: '';
         position: absolute;
         right: 0;
         width: 0.25rem;
         height: 100%;
         background-color: $minor-color;
     }
 }

 .sidebar-head {
     position: relative;
     // padding-block-end: 4rem;
 }

 .sidebar-toggle {
     padding-inline-start: $sidebar-padding-inline-start;
     background-color: transparent;
     border: 0;
 }

 h4 {
     padding-block-end: 1rem;
     padding-inline-start: $sidebar-padding-inline-start;
     user-select: none;
     pointer-events: none;
     opacity: 0.5;
     text-transform: uppercase;
     font-size: 0.75rem;
     letter-spacing: 0.125ch;
     transition: opacity $toggle-duration;
     text-align: left;
 }

 h4[transparent=true] {
     opacity: 0;
 }

 button {
     cursor: pointer;
     position: absolute;
     transition-duration: $toggle-duration;
     transition-property: transform, left, top;
     left: 0;
     top: 1rem;
     transform: translateX(0%) translateY(2rem) rotateZ(0deg);

     &.toggle-button {
         left: 100%;
         top: 0;
         transform: translateX(-100%) translateY(0rem) rotateZ(180deg);
     }
 }

 .fade-enter-active,
 .fade-leave-active {
     transition-property: opacity, transform;
     transition-duration: $toggle-duration;
 }

 .fade-enter-from,
 .fade-leave-to {
     opacity: 0;
     transform: translateX(-100%);
 }
</style>