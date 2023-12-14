<script setup lang="ts">

import { reactive, onMounted, ref } from "vue"
import Button from '@/common/Button.vue'
import SpeechIcon from '@/icons/Speech.vue'

export interface ISpeechProps {
    text?: string,
    lang?: string,
    volume?: number,
    pitch?: number,
    rate?: number,
}

const props = withDefaults(defineProps<ISpeechProps>(), {
    lang: 'en-US',
    volume: 1,
    pitch: 2,
    rate: 0.3,
})

const isLoading = ref(false)
let voiceList: SpeechSynthesisVoice[] = []
const speechSynthesis = window.speechSynthesis
const utterance = new SpeechSynthesisUtterance()


const speak = async (text?: string) => {
    const t = text ?? props.text
    if (!t) {
        return
    }

    utterance.text = t
    utterance.volume = props.volume
    utterance.pitch = props.pitch
    utterance.rate = props.rate
    utterance.lang = props.lang

    speechSynthesis.speak(utterance)
}

const listenForSpeechEvents = () => {
    utterance.onstart = () => {
        isLoading.value = true
    }

    utterance.onend = () => {
        isLoading.value = false
    }
}

const handleClick = () => {
    speak(undefined)
}

onMounted(() => {
    voiceList = speechSynthesis.getVoices()

    if (voiceList.length) {
        isLoading.value = false
    }

    speechSynthesis.onvoiceschanged = () => {
        voiceList = speechSynthesis.getVoices()
        setTimeout(() => {
            isLoading.value = false
        }, 800)
    }

    listenForSpeechEvents()
})
</script>

<template>
    <div>
        <Button Tip="speech to text" @click="handleClick" :IsLoading="isLoading">
            <SpeechIcon></SpeechIcon>
        </Button>
    </div>
</template> 
<style scoped></style>