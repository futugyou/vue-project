<script lang="ts" setup>
import { computed, inject } from 'vue'
import { globalMessageKey, messageKey, locationKey, DefaultLocation } from '../../tools/injectkey'

interface Book {
  title: string
  name: string
}
const props = defineProps<Book>()

const message = inject<string>(messageKey, '')
const globalMessage = inject<string>(globalMessageKey, '')
const { location, updateLocation } = inject(locationKey, DefaultLocation)

const emit = defineEmits<{
  (e: 'response', msg: string): void
  (e: 'update:title', msg: string): void
  (e: 'update:name', msg: string): void
}>()

emit('response', 'hello from child')

const updateTitle = (e: Event) => {
  emit('update:title', (e.target as HTMLInputElement).value)
}

const nameValue = computed<string>({
  get() {
    return props.name
  },
  set(value) {
    if (value) {
      emit('update:name', value)
    }
  }
})
</script>

<template>
  <div>
    <h2>Child component</h2>
    <slot>Fallback content</slot>
    <input :value="title" @input="updateTitle" /> <br />
    <input v-model="nameValue" />
    <h4>this is inject {{ message }}</h4>
    <h4>this is global inject {{ globalMessage }}</h4>
    <button @click="updateLocation">{{ location }}</button>
  </div>
</template>
