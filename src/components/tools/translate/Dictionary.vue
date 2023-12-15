<script lang="ts" setup>
import { ref, watch } from 'vue'

import {
    TranslateModel,
    lookupDictionary, DictionaryLookupModel,
} from './Translate'


export interface IDictionaryProps {
    text: string,
    from: string,
    to: string,
}

const props = withDefaults(defineProps<IDictionaryProps>(), {
    text: '',
    from: 'en',
    to: 'zh-Hans',
})

// const text = ref(props.text)
// const from = ref(props.from)
// const to = ref(props.to)
const dictionary = ref<DictionaryLookupModel[]>([])

const isLoading = ref(false)

const makeTranslateModel = (t: string) => {
    let text = t ?? ""
    text = text.replaceAll("\n", "").replaceAll("\r", "").trim()
    let model: TranslateModel[] = []
    if (text == "") {
        return model
    }

    model.push({ Text: text })
    return model
}

watch(
    () => [props.text, props.from, props.to],
    async () => {
        const selectedText = props.text.trim()
        if (selectedText.length == 0 || isLoading.value) {
            return
        }

        let model = makeTranslateModel(selectedText)
        if (model.length == 0) {
            return
        }

        isLoading.value = true
        const { data, error } = await lookupDictionary(props.from, props.to, model)
        isLoading.value = false
        if (error) {
            dictionary.value = []
            return
        }

        dictionary.value = data
    },
    { deep: true, immediate: true }
)

</script>

<template>
    <div class="dic-container">
        <div class="dic-item" v-for="dic in dictionary" :key="dic.normalizedSource">
            <div><span>{{ dic.normalizedSource }}</span></div>
            <div class="trans-container">
                <div v-for="t in dic.translations" :key="t.normalizedTarget">
                    <div class="tran-header">
                        <div> <span>{{ t.normalizedTarget }}</span></div>
                        <div> <span>{{ t.posTag }}</span></div>
                    </div>
                    <div class="tran-item-container">
                        <div v-for="bt in t.backTranslations" :key="bt.normalizedText">
                            <div> <span>{{ bt.normalizedText }}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dic-container {
    height: 100%;
    width: 100%;
    display: flex;
    grid-gap: var(--grid-gap-10);
    padding: 0;
    margin: 0;
    overflow: hidden;
    flex-direction: column;
    text-align: left;
    font-size: var(--default-font-size);
}

.dic-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    grid-gap: var(--grid-gap-10);
}

.trans-container {
    display: flex;
    grid-gap: var(--grid-gap-10);
    flex-direction: column;
}

.tran-header {
    display: flex;
    grid-gap: var(--grid-gap-10);
}

.tran-item-container {
    display: flex;
    grid-gap: var(--grid-gap-10);
}
</style>
