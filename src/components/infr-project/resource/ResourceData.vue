<script lang="ts" setup>
import { ref, onUnmounted } from 'vue'
import { marked } from 'marked'
import EmbedDrawio from '@/common/drawio'

const props = defineProps({
    data: String,
    type: String,
    imageData: String,
    showDrawio: Boolean,
})

let popupWindow: Window | null = null;
const showDrawIO = () => {
    if (props.data){
        sessionStorage.setItem('drawio-edit-value', props.data)
        popupWindow = window.open('/drawio', '_blank')
    }
}

onUnmounted(() => {
    sessionStorage.removeItem('drawio-edit-value')
})

</script>

<template>
    <v-sheet class="d-flex justify-space-around ma-3" v-if="imageData">
        <v-img :width="300" aspect-ratio="16/9" cover :src="imageData" @click="showDrawIO"></v-img>
    </v-sheet>

    <v-sheet v-else-if="type == 'Markdown'">
        <v-responsive :aspect-ratio="16 / 9">
            <div v-html="marked(data ?? '')"></div>
        </v-responsive>
    </v-sheet>

    <v-sheet v-else>
        <v-responsive :aspect-ratio="16 / 9">            
            <v-sheet>
                <div class="text-body-1 word-break">{{ data }}</div>
            </v-sheet>
        </v-responsive>
    </v-sheet>
</template>
