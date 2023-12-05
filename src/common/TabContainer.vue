<script lang="ts" setup>
import { shallowRef } from 'vue'
import { useTabStore } from '@/stores/tab'

const props = defineProps({
    components: Array
})

const tabState = useTabStore()
const currentCom = shallowRef(props.components ? props.components[tabState.value] : null)
const changeCurrent = (com: any) => {
    const index = props.components?.indexOf(com) ?? 0
    tabState.value = index
    currentCom.value = com
}
</script>

<template>
    <div class="tab-container" tag="div">
        <div v-for="(com, index) in components" class="tab-item" :key="index" :data-index="index">
            <Transition name="bounce">
                <div v-if="com != currentCom" class="tab-block" @click="changeCurrent(com)">
                    ...
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
    width: 20px;
    border-radius: 5px;
    color: hsla(160, 100%, 37%, 1);
    transition: 0.4s;
    cursor: pointer;
    height: 100%;
}

.tab-block:hover {
    background-color: hsl(160deg 70% 80%);
}
</style>
