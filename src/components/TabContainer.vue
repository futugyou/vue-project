<script lang="ts" setup>
import { shallowRef } from 'vue'
const props = defineProps({
    components: Array
})

const currentCom = shallowRef(props.components ? props.components[0] : null)

const changeCurrent = (com: any) => {
    currentCom.value = com
}
</script>

<template>
    <div class="tab-container">
        <div v-for="com in components" class="tab-item">
            <Transition>
                <div v-if="com != currentCom" class="tab-block" @click="changeCurrent(com)"></div>
            </Transition>

            <Transition>
                <div v-if="com == currentCom">
                    <component :is="com"></component>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.tab-container {
    display: flex;
    justify-content: center;
}

.tab-item {
    margin-right: 10px;
}

.tab-block {
    width: 20px;
    border-radius: 5px;
    background-color: #abd3d9;
    cursor: pointer;
    height: 100%;
}
</style>