<script lang="ts" setup>
import { ref } from 'vue'

const show = ref(false)
const show1 = ref(false)
const show2 = ref(false)

</script>

<template>
    <div class="container">
        <div class="layer">
            <button @click="show = !show">Toggle</button>
            <Transition>
                <p v-if="show">hello</p>
            </Transition>
            <Transition name="fade">
                <p v-if="show">hello</p>
            </Transition>
        </div>
        <div class="layer">
            <button @click="show1 = !show1">Toggle</button>
            <Transition name="slide-fade">
                <p v-if="show1">hello</p>
            </Transition>
        </div>
        <div class="layer">
            <button @click="show2 = !show2">Toggle</button>
            <Transition name="bounce">
                <p v-if="show2" style="text-align: center;">
                    Hello here is some bouncy text!
                </p>
            </Transition>
        </div>
    </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}


.bounce-enter-active {
    animation: bounce-in 0.5s;
}

.bounce-leave-active {
    animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.25);
    }

    100% {
        transform: scale(1);
    }
}</style>