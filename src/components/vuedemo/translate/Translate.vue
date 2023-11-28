<script lang="ts" setup>
import { ref, watchEffect, computed, onMounted, watch } from 'vue'
import Button from '@/components/Button.vue'

import { translateText, TranslateModel } from './Translate'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const left = ref("")
const right = ref("")

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
    const { data, error } = await translateText("en", "zh-Hans", model)
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

</script>

<template>
    <div class="full-content">
        <div class="text-container">
            <textarea v-model="left" placeholder="input your text" class="text-input"></textarea>
        </div>
        <div class="trans-but-container">
            <Button Text="Translate" @click="translate" :IsLoading="isLoading">
            </Button>
        </div>
        <div class="text-container">
            <textarea v-model="right" placeholder="" class="text-input"></textarea>
        </div>
    </div>
</template>

<style scoped>
.full-content {
    height: 100%;
    width: 100%;
    display: flex;
    grid-gap: 5px;
    padding: 0;
    margin: 0;
    overflow: hidden;
}

.text-container {
    flex-grow: 1;
    padding: 10px;
    margin: 10px;
}

.trans-but-container {
    display: flex;
    align-items: center;
    width: 130px;
    justify-content: space-around;
}

.text-input {
    width: 100%;
    height: 100%;
    font-size: 18px;
    border: 1px solid var(--color-border-text-normal-default);
    border-radius: 20px;
    line-height: 24px;
    text-align: left;
    padding: 10px;
}</style>
