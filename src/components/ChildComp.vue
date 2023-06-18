<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
    title: String,
    name: String
})
const emit = defineEmits<{
    (e: 'response', msg: string): void
    (e: 'update:title', msg: string): void
    (e: 'update:name', msg: string): void
}>()

emit('response', 'hello from child')

const updateTitle = (e: any) => {
    emit('update:title', e.target.value)
}

const nameValue = computed({
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
    </div>
</template>