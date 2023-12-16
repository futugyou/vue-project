<script lang="ts" setup>
import { ref, watch } from 'vue'
import Speech from '@/common/Speech.vue'

export interface IItemWithSpeechProps {
    lang: string,
    text: string,
}

const props = withDefaults(defineProps<IItemWithSpeechProps>(), {
    lang: 'en',
    text: '',
})

</script>

<template>
    <div class="text-container">
        <div>
            <slot></slot>
        </div>
        <div class="speech-btn">
            <Speech :lang="lang" :text="text"></Speech>
        </div>
    </div>
</template>

<style scoped>
.text-container {
    display: flex;
    grid-gap: var(--grid-gap-10);
    align-items: center;
    cursor: default;
    position: relative;
}

.text-container:hover {
    background-color: var(--color-background-normal-hover);
}

.speech-btn {
    display: none;
    position: absolute;
    right: 0;
}

.text-container:hover>.speech-btn {
    display: block;
}
</style>
