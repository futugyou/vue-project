<script lang="ts" setup>
import { useImmer } from '../reactivity/immerState'
import { useMachine } from '../reactivity/machine'

//Immer
const [items, setItems] = useImmer([
    {
        title: "Learn Vue",
        done: true
    },
    {
        title: "Use Vue with Immer",
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

</script>

<template>
    <div class="container">
        <div class="layer">
            <h2>immer</h2>
            <ul>
                <li v-for="({ title, done } ) in items" :class="{ done }" @click="toggleItem(title)">
                    {{ title }}
                </li>
            </ul>
        </div>
        <div class="layer">
            <button @click="send('TOGGLE')">
                {{ state.matches("inactive") ? "Off" : "On" }}
            </button>
        </div>
    </div>
</template>

<style> .container {
     grid-gap: 5px;
     display: grid;
     grid-template-columns: auto auto auto auto;
 }

 .layer {
     text-align: left;
     border: 1px solid #6acbe3;
     border-radius: 5px;
     padding: 20px;
     overflow: hidden;
     white-space: nowrap;
 }

 .done {
     text-decoration: line-through;
 }
</style>