<script lang="ts" setup>
import { shuffle as _shuffle } from 'lodash-es'
import { ref } from 'vue'

const show = ref(false)
const show1 = ref(false)
const show2 = ref(false)

const items = ref([1, 2, 3, 4])
let id = items.value.length + 1
const AddItem = () => {
    const i = Math.round(Math.random() * items.value.length)
    items.value.splice(i, 0, id++)
}

const RemoveItem = () => {
    const index = Math.round(Math.random() * items.value.length)
    items.value.splice(index, 1)
}

const Shuffle=()=>{
    items.value = _shuffle(items.value)
}

</script>

<template>
    <div class="container">
        <div class="layer">
            <button @click="show = !show">Toggle Transition</button>
            <Transition>
                <p v-if="show">hello</p>
            </Transition>
            <Transition name="fade">
                <p v-if="show">hello</p>
            </Transition>
        </div>
        <div class="layer">
            <button @click="show1 = !show1">Toggle Transition</button>
            <Transition name="slide-fade">
                <p v-if="show1">hello</p>
            </Transition>
        </div>
        <div class="layer">
            <button @click="show2 = !show2">Toggle Animation</button>
            <Transition name="bounce">
                <p v-if="show2" style="text-align: center;">
                    Hello here is some bouncy text!
                </p>
            </Transition>
        </div>
        <div class="layer">
            <button @click="AddItem">Add</button>
            <button @click="RemoveItem">Remove</button>
            <button @click="Shuffle">shuffle</button>
            <TransitionGroup name="list" tag="ul">
                <li v-for="item in items" :key="item">
                    {{ item }}
                </li>
            </TransitionGroup>
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
}

.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
</style>