
<script lang="ts" setup>
import { ref, PropType, computed, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'

import PDFViewer from '@/common/PDFViewer.vue'
import Button from '@/common/Button.vue'
import Operate from '@/icons/Operate.vue'
import TranslateBtn from '@/icons/Translate.vue'

import { translateText, TranslateModel } from '@/components/tools/translate/Translate'

import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
const store = useMessageStore()
const { msg } = storeToRefs(store)

const pdf = ref<InstanceType<typeof PDFViewer> | null>(null)

interface pagecontextinfo {
    page: number
    rawText: string
    text: string
    translateText: string
}

const translatedText = ref("")
const showTranslate = ref(false)
const isLoading = ref(false)

const translate = async () => {
    if (!pdf.value) {
        return
    }

    const pagecontextinfos = useLocalStorage<pagecontextinfo[]>(pdf.value?.pagecontextkey ?? "", [])
    const page = pagecontextinfos.value.find(p => p.page == pdf.value?.currentPage)
    if (!page) {
        return
    }

    let text: string = page.text
    let reg = text.match(/[^\n]+/g)

    if (!reg) {
        return
    }

    translatedText.value = ""
    isLoading.value = true

    let model: TranslateModel[] = []
    for (let i = 0; i < reg.length; i++) {
        model.push({
            Text: reg[i],
            Translation: ''
        })
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
        let translateText = ""
        for (let i = 0; i < data.length; i++) {
            const ele = data[i];
            for (let j = 0; j < ele.translations.length; j++) {
                const element = ele.translations[j];
                translateText += element.text + "\n"
            }
        }
        page.translateText = translateText
        translatedText.value = translateText
    }
}

const changeTranslatedText = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target == null) {
        return
    }

    const pagecontextinfos = useLocalStorage<pagecontextinfo[]>(pdf.value?.pagecontextkey ?? "", [])
    const pagecontextinfo = pagecontextinfos.value.find(p => p.page == pdf.value?.currentPage)

    if (!pagecontextinfo) {
        return
    }

    pagecontextinfo.translateText = target.value
}

watch(
    () => [pdf.value?.currentPage, pdf.value?.pagecontextkey, showTranslate],
    async () => {
        if (!pdf.value || !showTranslate.value) {
            return
        }

        const pagecontextinfos = useLocalStorage<pagecontextinfo[]>(pdf.value?.pagecontextkey ?? "", [])
        const page = pagecontextinfos.value.find(p => p.page == pdf.value?.currentPage)
        if (page) {
            if (page.translateText) {
                translatedText.value = page.translateText
            } else {
                await translate()
            }
        } else {
            translatedText.value = ""
        }
    },
    { deep: true }
)
</script>

<template>
    <div class="viewer-content">
        <div class="viewer-container">
            <PDFViewer ref="pdf">
            </PDFViewer>
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
                <textarea :value="translatedText" @input="changeTranslatedText" placeholder=""></textarea>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
.viewer-content {
    height: 100%;
    width: 100%;
    display: flex;
    grid-gap: var(--grid-gap-5);
    padding: 0;
    margin: 0;
    overflow: hidden;
    flex-direction: row;
    position: relative;
}

.viewer-container {
    flex: 2;
    padding: 5px;
    width: 100%;
    height: 100%;
}

.tran-contr {
    position: absolute;
    right: 10px;
    top: 12px;
}

.translate-container {
    display: flex;
    flex-direction: column;
    grid-gap: var(--grid-gap-10);
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
    grid-gap: var(--grid-gap-10);
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    height: 32px;
}
</style>