import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`
    )

    return await res.json()
  }
  // i think i can only export 'summary' and 'increment',
  // provides better encapsulation. 
  return { count, summary, countAdd, increment, getUserDataById }
})