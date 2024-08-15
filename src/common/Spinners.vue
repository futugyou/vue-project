<script lang="ts" setup>

const props = defineProps({
    size: { type: Number, default: () => 40 },
})

</script>

<template>
    <v-progress-circular color="red" indeterminate :size="size"></v-progress-circular>
</template>  