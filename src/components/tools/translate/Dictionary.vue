<script lang="ts" setup>
import { ref, watch } from 'vue'

import { lookupDictionaryExamples, lookupDictionary } from './Translate'

import type { TranslateModel, DictionaryLookupModel, DictionaryExampleModel } from './Translate'

import ItemWithSpeech from '@/common/ItemWithSpeech.vue'

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

const dictionary = ref<DictionaryLookupModel[]>([])

const isLoading = ref(false)

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

        let d = data as DictionaryLookupModel[]
        let modelExamples: TranslateModel[] = []
        for (let i = 0; i < d.length; i++) {
            const dic = d[i]!
            for (let j = 0; j < dic.translations.length; j++) {
                const trans = dic.translations[j]!
                let subExamples: TranslateModel[] = []
                for (let l = 0; l < trans.backTranslations.length; l++) {
                    const back = trans.backTranslations[l]!
                    subExamples.push({
                        "Text": back.normalizedText,
                        "Translation": trans.normalizedTarget,
                    })
                }

                if (subExamples.length == 0) {
                    subExamples.push({
                        "Text": dic.normalizedSource,
                        "Translation": trans.normalizedTarget,
                    })
                }

                modelExamples.push(...subExamples)
            }
        }

        const { data: examples, error: err } = await lookupDictionaryExamples(props.from, props.to, modelExamples)
        if (err) {
            dictionary.value = d
            return
        }

        for (let i = 0; i < d.length; i++) {
            const dic = d[i]!
            for (let j = 0; j < dic.translations.length; j++) {
                const trans = dic.translations[j]!
                for (let l = 0; l < trans.backTranslations.length; l++) {
                    const back = trans.backTranslations[l]!
                    const example = (examples as DictionaryExampleModel[])
                        .find(p => p.normalizedSource == back.normalizedText
                            && p.normalizedTarget == trans.normalizedTarget)
                    if (!example) {
                        continue
                    }

                    back.examples = example.examples.slice(0, 3)
                }
            }
        }
        dictionary.value = d
    },
    { deep: true, immediate: true }
)

</script>

<template>
    <div class="dic-container">
        <div class="item-container overflow-y" v-for="dic in dictionary" :key="dic.normalizedSource">
            <ItemWithSpeech :lang="from" :text="dic.normalizedSource">
                <span>{{ dic.normalizedSource }}</span>
            </ItemWithSpeech>
            <div class="item-container" v-for="t in dic.translations" :key="t.normalizedTarget">
                <ItemWithSpeech :lang="to" :text="t.normalizedTarget">
                    <div style="display:flex; grid-gap: 10px;">
                        <div>
                            <span>{{ t.normalizedTarget }}</span>
                        </div>
                        <div>
                            <span>{{ t.posTag }}</span>
                        </div>
                    </div>
                </ItemWithSpeech>
                <div class="item-container" v-for="bt in t.backTranslations" :key="bt.normalizedText">
                    <ItemWithSpeech :lang="from" :text="bt.normalizedText">
                        <span>{{ bt.normalizedText }}</span>
                    </ItemWithSpeech>
                    <div class="item-container" v-for="ex in bt.examples" :key="ex.sourcePrefix">
                        <ItemWithSpeech :lang="from" :text="ex.sourcePrefix + ex.sourceTerm + ex.sourceSuffix">
                            <span>{{ ex.sourcePrefix }}</span>
                            <span class="text-strong">{{ ex.sourceTerm }}</span>
                            <span>{{ ex.sourceSuffix }}</span>
                        </ItemWithSpeech>

                        <ItemWithSpeech :lang="to" :text="ex.targetPrefix + ex.targetTerm + ex.targetSuffix">
                            <span>{{ ex.targetPrefix }}</span>
                            <span class="text-strong">{{ ex.targetTerm }}</span>
                            <span>{{ ex.targetSuffix }}</span>
                        </ItemWithSpeech>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dic-container {
    border: 1px solid var(--color-border-text-normal-default);
    border-radius: var(--border-radius-input);
    height: 100%;
    width: 100%;
    display: flex;
    grid-gap: var(--grid-gap-10);
    padding: 10px;
    margin: 0;
    overflow: hidden;
    flex-direction: column;
    text-align: left;
    font-size: var(--default-font-size);
    position: relative;
}

.item-container {
    display: flex;
    grid-gap: var(--grid-gap-10);
    flex-direction: column;
    padding-left: 20px;
}

.item-container:first-child {
    padding-left: 0px;
}

.text-strong {
    font-weight: var(--default-font-strong-weight);
    margin: 0px 5px;
    font-style: oblique;
}
</style>
