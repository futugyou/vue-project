<script lang="ts" setup>

const props = defineProps({
    size: { type: Number, default: () => 40 },
})

</script>

<template>
    <div class="text-center w-100">
        <v-progress-circular color="red" indeterminate :size="size"></v-progress-circular>
    </div>
</template>  