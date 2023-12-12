<script lang="ts" setup>
import { ref, watchEffect, computed, onMounted, watch } from 'vue'
import Button from '@/common/Button.vue'
import Dropdown from '@/common/Dropdown.vue'

import { translateText, TranslateModel } from './Translate'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const left = ref("")
const right = ref("")
const from = ref("")
const to = ref("")

const isLoading = ref(false)
const translate = async () => {
    let text = left.value ?? ""
    text = text.replaceAll("\n", "").replaceAll("\r", "")
    if (!text) {
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
const langItems = { "en": "English", "zh-Hans": "Chinese" }
</script>

<template>
    <div class="full-content">
        <div class="text-container">
            <textarea v-model="left" placeholder="input your text"></textarea>
        </div>
        <div class="trans-but-container">
            <Dropdown :items="langItems" @changeSelected="changeFromLang"></Dropdown>
            <Button Text="Translate" @click="translate" :IsLoading="isLoading">
            </Button>
            <Dropdown :items="langItems" @changeSelected="changeToLang"></Dropdown>
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
