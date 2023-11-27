<script lang="ts" setup>
import { reactive } from "vue"
const props = defineProps<{
    width?: string,
    height?: string,
}>()

const theme = reactive({
    width: props.width ?? '3rem',
    height: props.height ?? '3rem',
})

</script>

<template>
    <div class="spinner-border text-info spinner-size" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</template> 
<style scoped>
.spinner-size {
    width: v-bind('theme.width');
    height: v-bind('theme.height');
}
</style>