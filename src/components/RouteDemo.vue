<script lang="ts" setup>
import { reactive, ref, computed, onMounted, watch, watchEffect, provide, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

</script>

<template>
    <div class="vueapp-container">
        <div class="vueapp-layer">
            <h1>Route Data</h1>
            <pre>{{ route }}</pre>
        </div>
    </div>
</template>