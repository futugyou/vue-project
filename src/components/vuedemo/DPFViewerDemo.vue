
<script lang="ts" setup>
import { ref, PropType, computed, watch } from 'vue'

import DPFViewer from '@/common/DPFViewer.vue'
import Button from '@/common/Button.vue'
import Operate from '@/icons/Operate.vue'
import TranslateBtn from '@/icons/Translate.vue'

import { translateText, TranslateModel } from '@/components/vuedemo/translate/Translate'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const pdf = ref()
const right = ref("")
const showTranslate = ref(false)
let currentText = ""

const isLoading = ref(false)

const translate = async () => {
    if (!pdf.value || !pdf.value.extractedText) {
        return
    }

    let text: string = pdf.value.extractedText
    let reg = text.match(/[^\n]+/g)

    if (!reg) {
        return
    }

    right.value = ""
    isLoading.value = true

    let model: TranslateModel[] = []
    for (let i = 0; i < reg.length; i++) {
        model.push({ Text: reg[i] })
    }

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
                right.value += element.text + "\n"
            }
        }
    }
}

watch(
    () => [pdf.value?.extractedText, showTranslate],
    async () => {
        if (!showTranslate.value || !pdf.value || !pdf.value.extractedText || pdf.value.extractedText == currentText) {
            return
        }
        await translate()
        currentText = pdf.value.extractedText
    },
    { deep: true }
)
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
            <div class="header">
                <Button Tip="do translate" @click="translate" :Disabled="isLoading">
                    <TranslateBtn></TranslateBtn>
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
    padding: 5px;
}

.tran-contr {
    position: absolute;
    right: 10px;
    top: 8px;
}

.translate-container {
    display: flex;
    flex-direction: column;
    grid-gap: 10px;
    flex: 1;
    padding: 5px;
}

.text-container {
    flex-grow: 1;
}

.header {
    display: flex;
    flex-direction: row;
    width: 100%;
    grid-gap: 10px;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    height: 32px;
}
</style>