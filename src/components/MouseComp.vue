<script lang="ts" setup>
import { useMouse } from './mouse'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>