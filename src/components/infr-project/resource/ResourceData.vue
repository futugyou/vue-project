<script lang="ts" setup>
import { ref, } from 'vue'
import { marked } from 'marked'
const props = defineProps({
    data: String,
    type: String,
})

</script>

<template>
    <v-img :aspect-ratio="16 / 9" :src="data" v-if="type !== 'Markdown'">
        <template v-slot:error>
            <v-sheet>
                <div class="text-body-1 word-break">{{ data }}</div>
            </v-sheet>
        </template>
    </v-img>
    <v-sheet v-if="type == 'Markdown'">
        <v-responsive :aspect-ratio="16 / 9">
            <div v-html="marked(data ?? '')"></div>
        </v-responsive>
    </v-sheet>
</template>
