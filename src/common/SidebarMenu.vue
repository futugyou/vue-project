<script setup lang="ts">

import { shallowRef, watch } from 'vue'
import { RouterLink } from 'vue-router'
import type { Component } from 'vue'
import { useMediaQuery } from '@vueuse/core'

import IconAngle from '@/icons/Angle.vue'

export interface SideMenuData {
    route: string
    label: string
    icon?: Component
}

export interface SideMenuDataList {
    items: SideMenuData[]
}

const isSmallScreen = useMediaQuery('(max-width: 768px)')

const props = defineProps<SideMenuDataList>()

const isSidebarOpen = shallowRef<Boolean>(false)

const isSidebarShow = shallowRef<Boolean>(false)

function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
}

const changeSidebarShowState = () => {
    isSidebarShow.value = !isSidebarShow.value
}

watch(isSmallScreen, () => {
    isSidebarShow.value = !isSmallScreen.value
})
</script>

<template>
    <div class="wrapper">
        <div class="icon-control" @click="changeSidebarShowState">
            <img src="@/assets/logo.svg" alt="logo" width="32px" height="32px">
        </div>
        <aside :vue:is-open="isSidebarOpen" v-if="isSidebarShow">
            <ul class="sidebar-head">
                <li>
                    <button class="sidebar-toggle" :class="isSidebarOpen ? 'toggle-button' : ''">
                        <IconAngle @click="toggleSidebar" />
                    </button>
                </li>
            </ul>

            <h4 :transparent="!isSidebarOpen">Menu</h4>

            <ul>
                <li v-for="item in items" :key="item.label">
                    <router-link :to="item.route">
                        <component :is="item.icon"></component>
                        <Transition name="fade">
                            <span v-show="isSidebarOpen">{{ item.label }}</span>
                        </Transition>
                    </router-link>
                </li>
            </ul>
        </aside>
    </div>
</template>

<style scoped lang="scss">
$primary-color: var(--vt-c-black-soft);
$minor-color: var(--vt-c-black-soft);
$sidebar-width: 4rem;
$sidebar-width: 4rem;
$toggle-duration: 300ms;
$sidebar-padding-inline-start: 1rem;

aside[vue\:is-open=true] {
    width: 3 * $sidebar-width;
}

.icon-control {
    position: fixed;
    top: 0;
    cursor: pointer;
    left: 0;
    z-index: 10;
    user-select: none;
    width: 64px;
    display: flex;
    height: 50px;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: rgb(0 0 255 / 20%);
    }
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
    cursor: pointer;
}

//  img:hover {
//      box-shadow: 4px 4px 2px 1px rgb(0 0 255 / 20%);
//  }

li {
    user-select: none;
    text-align: left;
    min-width: fit-content;
    cursor: pointer;

    &:hover {
        color: $minor-color;
        background-color: lighten($color: rgb(0 0 255 / 20%), $amount: 5);
    }

    & a {
        // border-right: 0.25rem solid white;
        display: flex;
        color: $primary-color;
        align-items: center;
        column-gap: 0.75rem;
        position: relative;
        padding-block: 0.5rem;
        padding-inline-start: $sidebar-padding-inline-start;
        padding-inline-end: $sidebar-padding-inline-start;
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
    margin: 0;
    padding: 0;
    margin-top: 50px;

}

.sidebar-head li {
    padding-inline-start: $sidebar-padding-inline-start;
    height: 32px;

    &:hover {
        color: inherit;
        background-color: inherit;
    }

    svg {
        &:hover {
            box-shadow: 4px 4px 2px 1px rgb(0 0 255 / 20%);
        }
    }
}

.sidebar-toggle {
    padding-inline-start: $sidebar-padding-inline-start;
    background-color: transparent;
    border: 0;
}

h4 {
    //  padding-block-end: 1rem;
    padding-inline-start: $sidebar-padding-inline-start;
    user-select: none;
    pointer-events: none;
    opacity: 0.5;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.125ch;
    transition: opacity $toggle-duration;
    text-align: left;
    margin: 0;
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
    //  top: 1rem;
    //  transform: translateX(0%) translateY(2rem) rotateZ(0deg);

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