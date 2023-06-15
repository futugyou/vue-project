<script  lang="ts" setup>
import { reactive, ref } from 'vue'

const counter = reactive({ count: 0 })
const message = ref('Hello World!')
const newTodo = ref("")
let id = 0
const todos = ref([
    { id: id++, text: 'Learn HTML' },
    { id: id++, text: 'Learn JavaScript' },
    { id: id++, text: 'Learn Vue' }
])

const pClass = ref('title')
const increment = () => {
    counter.count++
}

const OnInput = (e: any) => {
    message.value = e.target.value
}

const removeTodo = (todo: any) => {
    todos.value = todos.value.filter(i => i.id != todo.id)
}

const AddNewTodo = (e: any) => {
    if (newTodo.value.length > 0) {
        todos.value = todos.value.concat({ id: id++, text: newTodo.value })
        newTodo.value = ""
    }
}
</script>

<template>
    <h1>{{ message }}</h1>
    <p :class="pClass">Count is: {{ counter.count }}</p>
    <button @click="increment">Increment Count</button>
    <input :value="message" @input="OnInput" placeholder="Hello World!" v-if="counter.count % 2 == 0" />
    <input v-model="message" placeholder="Hello World!" v-if="counter.count % 2 == 1" />
    <h1 v-else>this match last 'v-if'</h1>
    <ul>
        <li v-for="item in todos" :key="item.id">
            {{ item.text }}<button @click="removeTodo(item)">X</button>
        </li>
    </ul>
    <h1 v-if="todos.length == 0">no items in todo list</h1>
    <input v-model="newTodo">
    <button @click="AddNewTodo">Add Todo</button>
</template>

<style>
.title {
    color: red;
}
</style>