<script lang="ts" setup>
import { computed, onUnmounted, } from 'vue'
import { formatContent } from '@/tools/textFormat'
import { useMarkedMermaid } from '@/composables/useMarkedMermaid'

const props = withDefaults(defineProps<{
    id: string,
    data: string,
    type: string,
    imageData: string,
    showDrawio?: boolean,
}>(), {
    id: "",
    data: "",
    type: "",
    imageData: "",
    showDrawio: true,
})

const { renderedHtml } = useMarkedMermaid(
    computed(() => props.type === 'Markdown' ? props.data : ''),
    { className: 'markdown-body' }
)

let popupWindow: Window | null = null;
const showDrawIO = () => {
    if (props.data && props.showDrawio) {
        sessionStorage.setItem('drawio-edit-value', props.data)
        popupWindow = window.open('/drawio?suffix=' + props.id, '_blank')
    }
}

const formatText = computed(() => {
    if (props.data) {
        const { formatted: result } = formatContent(props.data)
        return result
    }
    return ""
})

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
            <v-sheet class="markdown-body" aspect-ratio="16/9" v-html="renderedHtml"></v-sheet>
        </v-responsive>
    </v-sheet>

    <v-sheet v-else>
        <v-responsive :aspect-ratio="16 / 9" v-if="formatText">
            <v-sheet>
                <div class="text-body-1 word-break">{{ formatText }}</div>
            </v-sheet>
        </v-responsive>
    </v-sheet>
</template>
