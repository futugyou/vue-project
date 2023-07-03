import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useFetch } from '../composables/fetch'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  const increment = () => {
    count.value++
  }

  const summary = computed(() => {
    return count.value
  })

  // getter with paras
  const countAdd = computed(() => {
    return (n: number) => count.value + n
  })

  const getUserDataById = async (id: number) => {
    const { data, error } = await useFetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
    return data
  }
  // i think i can only export 'summary' and 'increment',
  // provides better encapsulation.
  return { count, summary, countAdd, increment, getUserDataById }
})
