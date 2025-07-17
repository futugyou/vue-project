<script setup lang="ts">

import { onMounted } from 'vue'

onMounted(() => {
    if (!document.querySelector('script[src="https://cse.google.com/cse.js?cx=f3ef0e77511e642f8"]')) {
        const script = document.createElement('script')
        script.src = 'https://cse.google.com/cse.js?cx=f3ef0e77511e642f8'
        script.async = true
        document.head.appendChild(script)
    }
})

</script>

<template>
    <v-sheet>
        <div class="gcse-search"></div>
    </v-sheet>
</template>

<style scoped> 
</style>
