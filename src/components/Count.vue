<script  lang="ts" setup>
import { reactive, ref, computed } from 'vue'

const counter = reactive({ count: 0 })
const message = ref('Hello World!')
const newTodo = ref("")
const hideCompleted = ref(false)

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

const OnInput = (e: any) => {
    message.value = e.target.value
}

const removeTodo = (todo: any) => {
    todos.value = todos.value.filter(i => i.id != todo.id)
}

const AddNewTodo = (e: any) => {
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

</script>

<template>
    <h1>{{ message }}</h1>
    <p :class="pClass">Count is: {{ counter.count }}</p>
    <button @click="increment">Increment Count</button>
    <input :value="message" @input="OnInput" placeholder="Hello World!" v-if="counter.count % 2 == 0" />
    <input v-model="message" placeholder="Hello World!" v-if="counter.count % 2 == 1" />
    <h1 v-else>this match last 'v-if'</h1>

    <input v-model="newTodo">
    <button @click="AddNewTodo">Add Todo</button>
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
</template>

<style>
.title {
    color: red;
}

.done {
    text-decoration: line-through;
}
</style>