<script lang="ts" setup>
import { ref, computed, shallowRef, reactive, watch } from 'vue'
import { shuffle as _shuffle } from 'lodash-es'
import gsap from 'gsap'

import CompA from './CompA.vue'
import CompB from './CompB.vue'
import MyModal from './MyModal.vue'

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

const Shuffle = () => {
  items.value = _shuffle(items.value)
}

const list = [
  { msg: 'Bruce Lee' },
  { msg: 'Jackie Chan' },
  { msg: 'Chuck Norris' },
  { msg: 'Jet Li' },
  { msg: 'Kung Fury' }
]

const query = ref('')

const computedList = computed(() => {
  return list.filter((item) => item.msg.toLowerCase().includes(query.value))
})

const onBeforeEnter = (el: any) => {
  el.style.opacity = 0
  el.style.height = 0
}

const onEnter = (el: any, done: any) => {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}

const onLeave = (el: any, done: any) => {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}

const current = shallowRef(CompA)

// shake
const disabled = ref(false)

const warnDisabled = () => {
  disabled.value = true
  setTimeout(() => {
    disabled.value = false
  }, 1500)
}

//
const x = ref(0)
const onMousemove = (e: any) => {
  x.value = e.clientX
}

//
const number = ref(0)
const tweened = reactive({
  number: 0
})

watch(number, (n) => {
  gsap.to(tweened, { duration: 0.5, number: Number(n) || 0 })
})
</script>

<template>
  <div class="vueapp-container">
    <div class="vueapp-layer">
      <button @click="show = !show">Toggle Transition</button>
      <Transition>
        <p v-if="show">hello</p>
      </Transition>
      <Transition name="fade">
        <p v-if="show">hello</p>
      </Transition>
    </div>
    <div class="vueapp-layer">
      <button @click="show1 = !show1">Toggle Transition</button>
      <Transition name="slide-fade">
        <p v-if="show1">hello</p>
      </Transition>
    </div>
    <div class="vueapp-layer">
      <button @click="show2 = !show2">Toggle Animation</button>
      <Transition name="bounce">
        <p v-if="show2" style="text-align: center">Hello here is some bouncy text!</p>
      </Transition>
    </div>
    <div class="vueapp-layer">
      <button @click="AddItem">Add</button>
      <button @click="RemoveItem">Remove</button>
      <button @click="Shuffle">shuffle</button>
      <TransitionGroup name="list" tag="ul">
        <li v-for="item in items" :key="item">
          {{ item }}
        </li>
      </TransitionGroup>
    </div>
    <div class="vueapp-layer">
      <input v-model="query" />
      <TransitionGroup
        tag="ul"
        :css="false"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
      >
        <li v-for="(item, index) in computedList" :key="item.msg" :data-index="index">
          {{ item.msg }}
        </li>
      </TransitionGroup>
    </div>
    <div class="vueapp-layer">
      <input type="radio" :value="CompA" v-model="current" />A
      <input type="radio" :value="CompB" v-model="current" />B
      <KeepAlive>
        <component :is="current"></component>
      </KeepAlive>
    </div>
    <div class="vueapp-layer">
      <div class="outer">
        <h3>Tooltips with Vue 3 Teleport</h3>
        <div>
          <MyModal />
        </div>
      </div>
    </div>
    <div class="vueapp-layer">
      <h3>shake</h3>
      <div :class="{ shake: disabled }">
        <button @click="warnDisabled">Click me</button>
        <span v-if="disabled">This feature is disabled!</span>
      </div>
    </div>
    <div class="vueapp-layer">
      <h3>hsl() function</h3>
      <div
        @mousemove="onMousemove"
        :style="{ backgroundColor: `hsl(${x}, 80%, 50%)` }"
        class="movearea"
      >
        <p>Move your mouse across this div...</p>
        <p>x: {{ x }}</p>
      </div>
    </div>
    <div class="vueapp-layer">
      <h3>hsl() function</h3>
      <div class="demo">
        Type a number: <input v-model.number="number" />
        <p class="big-number">{{ tweened.number.toFixed(0) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.list-move,
/* 对移动中的元素应用的过渡 */
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

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.movearea {
  transition: 0.3s background-color ease;
}

.big-number {
  font-weight: bold;
  font-size: 2em;
}
</style>
