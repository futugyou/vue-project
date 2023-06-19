<script lang="ts" setup>
import { reactive, ref, computed, onMounted, watch, watchEffect, provide } from 'vue'
import ChildComp from './ChildComp.vue'
import MouseComp from './MouseComp.vue'


const props = defineProps({
    id: Number
})

const counter = reactive({ count: 0 })
const message = ref('Hello World!')
provide('message', message)

const location = ref('North Pole')

function updateLocation() {
    location.value = 'South Pole'
}

provide('location', {
    location,
    updateLocation
})

const newTodo = ref("")
const hideCompleted = ref(false)
const refforP = ref<HTMLElement>()

let id = props.id ?? 0
const todos = ref([
    { id: id++, text: 'Learn HTML', done: true },
    { id: id++, text: 'Learn JavaScript', done: true },
    { id: id++, text: 'Learn Vue', done: false }
])

const pClass = ref('title')
const increment = () => {
    counter.count++
}

const onInput = (e: any) => {
    message.value = e.target.value
}

const removeTodo = (todo: any) => {
    todos.value = todos.value.filter(i => i.id != todo.id)
}

const addNewTodo = (e: any) => {
    if (newTodo.value.length > 0) {
        todos.value = todos.value.concat({ id: id++, text: newTodo.value, done: false })
        newTodo.value = ""
    }
}

const filteredTodos = computed(() => {
    if (hideCompleted.value) {
        return todos.value.filter(i => i.done == false)
    }

    return todos.value
})

onMounted(() => {
    refforP.value!.innerHTML = "this is test"
})

// watch
watch(counter, (newCount) => {
    // 没错，console.log() 是一个副作用
    console.log(`new count is: ${newCount.count}`)
})

// watch 2
const todoId = ref(1)
const todoData = ref(null)

const fetchData = async () => {
    todoData.value = null
    const res = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    todoData.value = await res.json()
}

fetchData()
watch(todoId, fetchData)

// watch 3
const todoId1 = ref(1)
const todoData1 = ref(null)
watchEffect(async () => {
    todoData1.value = null
    const res = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId1.value}`
    )
    todoData1.value = await res.json()
})

// child emit
const childMsg = ref('No child msg yet')
const childTitle = ref("")
const childName = ref("")
const childEmit = (msg: string) => {
    childMsg.value = msg
}

// keyup
const keyupValue = ref("")
const onCtrlEnter = () => {
    keyupValue.value = keyupValue.value.split('').reverse().join('')
}

// ref 2
const funcRefValue = ref("")
const inputRef = (el: any) => {
    if (el != undefined && el.value != "") {
        console.log(el.value)
    }
}

</script>

<template>
    <div class="container">
        <div class="layer">
            <h1>{{ message }}</h1>
            <p :class="pClass">Count is: {{ counter.count }}</p>
            <button @click="increment">Increment Count</button>
        </div>
        <div class="layer">
            <input :value="message" @input="onInput" placeholder="Hello World!" v-if="counter.count % 2 == 0" />
            <input v-model="message" placeholder="Hello World!" v-if="counter.count % 2 == 1" />
            <h1 v-else>this match last 'v-if'</h1>
        </div>
        <div class="layer">
            <input v-model="newTodo">
            <button @click="addNewTodo">Add Todo</button>
            <ul>
                <li v-for="item in filteredTodos" :key="item.id">
                    <input type="checkbox" v-model="item.done">
                    <span :class="{ done: item.done }">{{ item.text }}</span>
                    <button @click="removeTodo(item)">X</button>
                </li>
            </ul>
            <h1 v-if="todos.length == 0">no items in todo list</h1>

            <button @click="hideCompleted = !hideCompleted">
                {{ hideCompleted ? 'Show all' : 'Hide completed' }}
            </button>
        </div>
        <div class="layer">
            <p ref="refforP">hello</p>
        </div>
        <div class="layer">
            <p>Todo id: {{ todoId }}</p>
            <button @click="todoId++">Fetch next todo</button>
            <p v-if="!todoData">Loading...</p>
            <pre v-else>{{ todoData }}</pre>
        </div>
        <div class="layer">
            <p>Todo id: {{ todoId1 }}</p>
            <button @click="todoId1++">Fetch1 next todo</button>
            <p v-if="!todoData1">Loading...</p>
            <pre v-else>{{ todoData1 }}</pre>
        </div>
        <div class="layer">
            <span>Title: {{ childTitle }}</span> <br />
            <span>Name: {{ childName }}</span>
            <ChildComp @response="childEmit" v-model:title="childTitle" v-model:name="childName">
                <p>{{ childMsg }}</p>
            </ChildComp>
        </div>
        <div class="layer">
            <h2>key up</h2>
            <input @keyup.ctrl.enter="onCtrlEnter" v-model="keyupValue" />
        </div>
        <div class="layer">
            <h2>Func Ref</h2>
            <input :ref="inputRef" v-model="funcRefValue">
        </div>
        <div class="layer">
            <MouseComp></MouseComp>
        </div>
    </div>
</template>

<style>
.title {
    color: red;
}

.done {
    text-decoration: line-through;
}

.container {
    /* display: flex;
    flex-direction: column;
    align-items: center; */
    grid-gap: 5px;
    display: grid;
    grid-template-columns: auto auto auto auto;
}

.layer {
    /* width: 50%; */
    text-align: left;
    border: 1px solid #6acbe3;
    border-radius: 5px;
    /* margin: 5px 0; */
    padding: 20px;
    overflow: hidden;
    white-space: nowrap;
}
</style>