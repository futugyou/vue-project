<script lang="ts" setup>
import { shallowRef } from 'vue'
import type { Component } from 'vue'
import { useTabStore } from '@/stores/tab'

export interface ITabContainerProps {
    components: Record<string, Component>
}

const props = defineProps<ITabContainerProps>()

const tabState = useTabStore()
const currentCom = shallowRef(props.components ? props.components[tabState.value] : null)

const changeCurrent = (name: string) => {
    const com = props.components[name]
    tabState.value = name
    currentCom.value = com
}
</script>

<template>
    <div class="tab-container" tag="div">
        <div v-for="(com, name) in components" class="tab-item" :key="name" :data-index="name">
            <Transition name="bounce">
                <div v-if="com != currentCom" class="tab-block" @click="changeCurrent(name)">
                    {{ name }}...
                </div>
            </Transition>
            <Transition name="bounce">
                <div v-if="com == currentCom">
                    <component :is="com"></component>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.tab-container {
    display: flex;
    justify-content: center;
    padding: 10px 0;
}

.tab-item {
    margin-right: 10px;
    display: flex;
}

.tab-block {
    border-radius: 5px;
    color: hsl(84deg, 100%, 37%, 1);
    transition: 0.4s;
    cursor: pointer;
    height: 100%;
}

.tab-block:hover {
    background-color: hsl(160deg 70% 80%);
}
</style>
