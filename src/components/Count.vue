<script  lang="ts" setup>
import { reactive, ref, computed ,onMounted } from 'vue'

const counter = reactive({ count: 0 })
const message = ref('Hello World!')
const newTodo = ref("")
const hideCompleted = ref(false)
const p = ref(null)

let id = 0
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
  p.value.innerHTML="this is test"
})

</script>

<template>
    <h1>{{ message }}</h1>
    <p :class="pClass">Count is: {{ counter.count }}</p>
    <button @click="increment">Increment Count</button>
    <input :value="message" @input="onInput" placeholder="Hello World!" v-if="counter.count % 2 == 0" />
    <input v-model="message" placeholder="Hello World!" v-if="counter.count % 2 == 1" />
    <h1 v-else>this match last 'v-if'</h1>

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
    <p ref="p">hello</p>
</template>

<style>
.title {
    color: red;
}

.done {
    text-decoration: line-through;
}
</style>