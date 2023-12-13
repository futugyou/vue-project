<script lang="ts" setup>
import { ref, watchEffect, computed, onMounted, watch } from 'vue'
import Button from '@/common/Button.vue'
import Dropdown from '@/common/Dropdown.vue'

import { translateText, TranslateModel, detectLanguage, DetectLanguageModel } from './Translate'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const left = ref("")
const right = ref("")
const from = ref("en")
const to = ref("zh-Hans")
const isLoading = ref(false)

const langItems: Record<string, string> = { "en": "English", "zh-Hans": "Chinese" }

const translate = async () => {
    let text = left.value ?? ""
    text = text.replaceAll("\n", "").replaceAll("\r", "")
    if (!text || text == "") {
        return
    }

    if (from.value == to.value || !langItems[from.value] || !langItems[to.value]) {
        return
    }

    right.value = ""
    isLoading.value = true

    let model: TranslateModel[] = []
    model.push({ Text: text })
    const { data, error } = await translateText(from.value, to.value, model)
    isLoading.value = false

    if (error) {
        msg.value = {
            errorMessages: [error.message],
            delay: 3000,
        }
        return
    }

    if (data) {
        for (let i = 0; i < data.length; i++) {
            const ele = data[i];
            for (let j = 0; j < ele.translations.length; j++) {
                const element = ele.translations[j];
                right.value += element.text
            }
        }
    }
}

const changeFromLang = (lang: string) => {
    from.value = lang
}

const changeToLang = (lang: string) => {
    to.value = lang
}

const inputeChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target == null) {
        return
    }

    let text = target.value ?? ""
    text = text.replaceAll("\n", "").replaceAll("\r", "")
    if (!text || text == "") {
        return
    }

    let model: TranslateModel[] = []
    model.push({ Text: text })
    const { data, error } = await detectLanguage(from.value, to.value, model)
    if (error) {
        return
    }

    const r = data as DetectLanguageModel[]
    if (!r || r.length == 0) {
        return
    }

    const d = r.sort((a, b) => b.score - a.score)[0]
    if (d.isTranslationSupported) {
        from.value = d.language
    }
}
</script>

<template>
    <div class="full-content">
        <div class="text-container">
            <textarea v-model="left" placeholder="input your text" @change="inputeChange"></textarea>
        </div>
        <div class="trans-but-container">
            <Dropdown :items="langItems" @changeSelected="changeFromLang" :defaultValue="from" :key="from"></Dropdown>
            <Button Text="Translate" @click="translate" :IsLoading="isLoading">
            </Button>
            <Dropdown :items="langItems" @changeSelected="changeToLang" :defaultValue="to"></Dropdown>
        </div>
        <div class="text-container">
            <textarea v-model="right" placeholder=""></textarea>
        </div>
    </div>
</template>

<style scoped>
.full-content {
    height: 100%;
    width: 100%;
    display: flex;
    grid-gap: var(--grid-gap-5);
    padding: 0;
    margin: 0;
    overflow: hidden;
    flex-direction: row;
}

.text-container {
    flex: 1;
    padding: 10px;
    margin: 10px;
}

.trans-but-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    width: 200px;
}
</style>
