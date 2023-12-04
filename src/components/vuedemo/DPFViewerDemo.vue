
<script lang="ts" setup>
import { ref, PropType, computed } from 'vue'

import DPFViewer from '@/components/DPFViewer.vue'
import Button from '@/components/Button.vue'
import Operate from '@/components/icons/Operate.vue'
import { translateText, TranslateModel } from '@/components/vuedemo/translate/Translate'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const pdf = ref()
const right = ref("")
const showTranslate = ref(false)

const isLoading = ref(false)
const translate = async () => {
    if (!pdf.value || !pdf.value.extractedText) {
        return
    }

    let text: string = pdf.value.extractedText
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
    <div class="viewer-content">
        <div class="viewer-container">
            <DPFViewer ref="pdf">
            </DPFViewer>
        </div>
        <div class="tran-contr">
            <Button @click="showTranslate = !showTranslate">
                <Operate></Operate>
            </Button>
        </div>
        <div class="translate-container" v-if="showTranslate">
            <div>
                <Button Text="Translate" @click="translate" :IsLoading="isLoading">
                </Button>
            </div>
            <div class="text-container">
                <textarea v-model="right" placeholder=""></textarea>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
.viewer-content {
    height: 100%;
    width: 100%;
    display: flex;
    grid-gap: 5px;
    padding: 0;
    margin: 0;
    overflow: hidden;
    flex-direction: row;
    position: relative;
}

.viewer-container {
    flex: 2;
}

.tran-contr {
    position: absolute;
    right: 10px;
    top: 2px;
}

.translate-container {
    display: flex;
    flex-direction: column;
    grid-gap: 10px;
    flex: 1;
}

.text-container {
    flex-grow: 1;
}
</style>