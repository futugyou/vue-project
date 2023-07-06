<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const accountId = computed(() => route.params.accountId)

</script>

<template>
    <div class="full-content">
        this account id is {{ accountId }}
    </div>
</template>

<style scoped></style>
