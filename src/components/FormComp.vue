<script lang="ts" setup>
import { reactive, ref, computed, onMounted, watch, watchEffect } from 'vue'


</script>

<template>
    <div class="container">
        <div class="layer">

        </div>
    </div>
</template>

<style> .container {
     grid-gap: 5px;
     display: grid;
     grid-template-columns: auto auto auto auto;
 }

 .layer {
     text-align: left;
     border: 1px solid #6acbe3;
     border-radius: 5px;
     padding: 20px;
     overflow: hidden;
     white-space: nowrap;
 }
</style>