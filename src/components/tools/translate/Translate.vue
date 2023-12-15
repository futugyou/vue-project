<script lang="ts" setup>
import { ref, watchEffect, computed, onMounted, watch } from 'vue'
import Button from '@/common/Button.vue'
import Speech from '@/common/Speech.vue'
import Dropdown from '@/common/Dropdown.vue'
import Dictionary from './Dictionary.vue'

import {
    translateText, TranslateModel,
    detectLanguage, DetectLanguageModel,
    languageList, LanguageListModel,
} from './Translate'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const left = ref("")
const right = ref("")
const from = ref("en")
const to = ref("zh-Hans")
const selectedText = ref("")
const isLoading = ref(false)
const isDetectLoading = ref(false)
const isLookupLoading = ref(false)

const langItems = ref<Record<string, string>>({ "en": "English", "zh-Hans": "Chinese" })

const translate = async () => {
    if (from.value == to.value || !langItems.value[from.value] || !langItems.value[to.value]) {
        return
    }

    let model = makeTranslateModel(left.value)
    if (model.length == 0) {
        return
    }

    right.value = ""
    isLoading.value = true

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
    if (target == null || isDetectLoading.value) {
        return
    }

    let model = makeTranslateModel(target.value)
    if (model.length == 0) {
        return
    }

    isDetectLoading.value = true
    const { data, error } = await detectLanguage(from.value, to.value, model)
    isDetectLoading.value = false
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

const selectText = () => {
    const selection = window.getSelection()
    if (!selection || isLookupLoading.value) {
        return
    }

    const t = selection.toString().trim()
    if (t) {
        selectedText.value = t
    }
}

const makeTranslateModel = (t: string) => {
    let text = t ?? ""
    text = text.replaceAll("\n", "").replaceAll("\r", "").trim()
    let model: TranslateModel[] = []
    if (text == "") {
        return model
    }

    model.push({
        Text: text,
        Translation: ''
    })
    return model
}

watchEffect(async () => {
    const { data, error } = await languageList()

    if (error) {
        return
    }

    const r = data as LanguageListModel
    for (const key in r.translation) {
        const value = r.translation[key]
        if (!langItems.value[key]) {
            langItems.value[key] = value.name
        }
    }
})
</script>

<template>
    <div class="full-content">
        <div class="text-container">
            <textarea v-model="left" placeholder="input your text" @change="inputeChange" @mouseup="selectText"></textarea>
            <div class="speech-btn">
                <Speech :lang="from" :text="left"></Speech>
            </div>
        </div>
        <div class="trans-but-container">
            <Dropdown :items="langItems" @changeSelected="changeFromLang" :defaultValue="from" :key="from"></Dropdown>
            <Button Text="Translate" @click="translate" :IsLoading="isLoading">
            </Button>
            <Dropdown :items="langItems" @changeSelected="changeToLang" :defaultValue="to"></Dropdown>
        </div>
        <div class="text-container">
            <textarea v-model="right" placeholder=""></textarea>
            <div class="speech-btn">
                <Speech :lang="to" :text="right"></Speech>
            </div>
        </div>
        <div class="text-container" v-if="selectedText != ''">
            <Dictionary :text="selectedText" :from="from" :to="to" :key="selectedText"></Dictionary>
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
    overflow: hidden;
    position: relative;
}

.trans-but-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    width: 200px;
    position: relative;
}

.speech-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    display: none;
}

.text-container:hover .speech-btn {
    display: block;
}
</style>
