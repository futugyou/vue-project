<script lang="ts" setup>
const props = defineProps({
    title: String
})
const emit = defineEmits<{
    (e: 'response', msg: string): void
    (e: 'update:title', msg: string): void
}>()

emit('response', 'hello from child')

const updateTitle = (e: any) => {
    emit('update:title', e.target.value)
}
</script>

<template>
    <div>
        <h2>Child component</h2>
        <slot>Fallback content</slot>
        <input :value="title" @input="updateTitle" />
    </div>
</template>