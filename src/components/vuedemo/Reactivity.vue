<script lang="ts" setup>
import { useImmer } from '../../reactivity/immerState'
import { useMachine, useMachine2 } from '../../reactivity/machine'
import { useCounterStore } from '../../stores/counter'

const store = useCounterStore()
//Immer
const [items, setItems] = useImmer([
  {
    title: 'Learn Vue',
    done: true
  },
  {
    title: 'Use Vue with Immer',
    done: false
  }
])

const toggleItem = (index: string) => {
  setItems((items: any) => {
    items[index].done = !items[index].done
  })
}

// xstate
const [state, send] = useMachine({
  id: 'toggle',
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } }
  }
})

// xstate/vue
const [state2, send2] = useMachine2()
</script>

<template>
  <div class="vueapp-container">
    <div class="vueapp-layer">
      <h2>immer</h2>
      <ul>
        <li v-for="{ title, done } in items" :class="{ done }" @click="toggleItem(title)">
          {{ title }}
        </li>
      </ul>
    </div>
    <div class="vueapp-layer">
      <h2>immer</h2>
      <button @click="send('TOGGLE')">
        {{ state.matches('inactive') ? 'Off' : 'On' }}
      </button>
    </div>
    <div class="vueapp-layer">
      <h2>xstate/vue</h2>
      <button @click="send2('TOGGLE')">
        Click me ({{ state2.matches('active') ? '✅' : '❌' }})
      </button>
      <code>
        Toggled
        <strong>{{ state2.context.count }}</strong> times
      </code>
    </div>
    <div class="vueapp-layer">
      <h3>{{ store.count }}</h3>
      <button @click="store.increment">increment</button>
    </div>
  </div>
</template>

<style scoped>
.done {
  text-decoration: line-through;
}
</style>
