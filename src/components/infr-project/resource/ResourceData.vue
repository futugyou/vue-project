<script lang="ts" setup>
import { ref, computed, onUnmounted, } from 'vue'
import { useRouter } from 'vue-router'
import { toSvg } from 'html-to-image'

import { formatContent } from '@/tools/textFormat'
import { patchWindowOpen } from '@/tools/util'
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
    type: "Markdown",
    imageData: "",
    showDrawio: false,
})

const router = useRouter()
const { renderedHtml } = useMarkedMermaid(
    computed(() => props.type === 'Markdown' ? props.data : ''),
    { className: 'markdown-body' }
)

let popupWindow: Window | null = null;
const showDrawIOPage = () => {
    if (props.type == "DrawIO") {
        sessionStorage.setItem('drawio-edit-value', props.data)
        const r = router.resolve({ name: 'Drawio', query: { suffix: props.id } })
        patchWindowOpen(r.href)
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

const dialogVisible = ref(false)
const openDialog = () => dialogVisible.value = true

const getResourceDataImage = async () => {
    if (props.imageData) {
        return props.imageData
    }
    var imageDom = document.getElementById('image-preview')
    if (imageDom) {
        var a = await toSvg(imageDom)
        console.log(a)
    }
    return ""
}

defineExpose({
    getResourceDataImage: getResourceDataImage,
    showDrawIOPage: showDrawIOPage,
})
</script>

<template>
    <v-sheet class="d-flex justify-space-around ma-3 cursor-zoom-in" v-if="imageData">
        <v-img v-if="showDrawio" :aspect-ratio="16 / 9" cover :src="imageData" @click="showDrawIOPage" />
        <v-img v-else :aspect-ratio="16 / 9" cover :src="imageData" @click="openDialog" />
    </v-sheet>

    <v-sheet class="d-flex justify-space-around ma-3 cursor-zoom-in" @click="openDialog" v-else>
        <v-responsive v-if="type === 'Markdown'" :aspect-ratio="16 / 9">
            <v-sheet class="markdown-body" v-html="renderedHtml" id="image-preview" />
        </v-responsive>
        <v-responsive v-else :aspect-ratio="16 / 9" v-if="formatText">
            <v-sheet>
                <div id="image-preview" class="text-body-1 word-break">{{ formatText }}</div>
            </v-sheet>
        </v-responsive>
    </v-sheet>

    <v-dialog v-model="dialogVisible" max-width="90%" scrollable :closeOnContentClick="true" :persistent="true">
        <v-card class="cursor-zoom-out">
            <v-card-text>
                <v-img v-if="imageData" cover :src="imageData" />
                <v-sheet v-else-if="type === 'Markdown'" class="markdown-body" v-html="renderedHtml" />
                <div v-else class="text-body-1 word-break">{{ formatText }}</div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
