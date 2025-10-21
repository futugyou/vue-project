<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps({
    badgeMarkdown: String
})

interface ExtractedData {
    url?: string
    link?: string
    alt?: string
    type: number
}

const regex1 = /!\[([^\]]+)\]\(([^&]+)&link=([^&\)]+)\)/
const regex2 = /!\[([^\]]+)\]\(([^&\)]+)\)/
const regex3 = /\[!\[([^\]]+)\]\(([^&\)]+)\)\]\(([^&\)]+)\)/

const extractText = (text: string): ExtractedData => {
    let match: RegExpMatchArray | null

    match = text.match(regex3)
    if (match) {
        return { alt: match[1], url: match[2], link: match[3], type: 1 }
    }

    match = text.match(regex1)
    if (match) {
        return { alt: match[1], url: match[2], link: match[3], type: 1 }
    }

    match = text.match(regex2)
    if (match) {
        return { alt: match[1], url: match[2], link: undefined, type: 2 }
    }

    return { url: text, type: 3 }
}

const d = ref<ExtractedData>(extractText(props.badgeMarkdown ?? ""))

watch(() => props.badgeMarkdown, (newVal) => {
    d.value = extractText(newVal ?? "")
})

</script>

<template>
    <v-sheet v-if="d">
        <div>
            <p>
                <a :href="d.link" target="_blank" v-if="d.type == 1" class="d-flex align-center">
                    <img :src="d.url" :alt="d.alt">
                </a>
                <img :src="d.url" :alt="d.alt" v-if="d.type == 2">
                <img :src="d.url" alt="badge" v-if="d.type == 3">
            </p>
        </div>
    </v-sheet>
</template>
