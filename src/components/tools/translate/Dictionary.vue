<script lang="ts" setup>
import { ref, watch } from 'vue'

import {
    TranslateModel, lookupDictionaryExamples,
    lookupDictionary, DictionaryLookupModel,
    DictionaryExampleModel,
} from './Translate'

import Speech from '@/common/Speech.vue'
import { ArrayChunks } from '@/tools/util'

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
            const dic = d[i]
            for (let j = 0; j < dic.translations.length; j++) {
                const trans = dic.translations[j]
                let subExamples: TranslateModel[] = []
                for (let l = 0; l < trans.backTranslations.length; l++) {
                    const back = trans.backTranslations[l]
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
            const dic = d[i]
            for (let j = 0; j < dic.translations.length; j++) {
                const trans = dic.translations[j]
                for (let l = 0; l < trans.backTranslations.length; l++) {
                    const back = trans.backTranslations[l]
                    const subexamples = (examples as DictionaryExampleModel[])
                        .filter(p => p.normalizedSource == back.normalizedText
                            && p.normalizedTarget == trans.normalizedTarget)
                    if (subexamples.length == 0) {
                        continue
                    }

                    const exampleChunks = ArrayChunks(subexamples[0].examples, 3)
                    if (exampleChunks.length == 0) {
                        continue
                    }

                    back.examples = exampleChunks[0]
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
        <div class="dic-item" v-for="dic in dictionary" :key="dic.normalizedSource">
            <div class="label-container">
                <div>
                    <span>{{ dic.normalizedSource }}</span>
                </div>
                <div class="speech-btn">
                    <Speech :lang="from" :text="dic.normalizedSource"></Speech>
                </div>
            </div>
            <div class="trans-container">
                <div v-for="t in dic.translations" :key="t.normalizedTarget">
                    <div class="label-container">
                        <div>
                            <span>{{ t.normalizedTarget }}</span>
                        </div>
                        <div class="speech-btn">
                            <Speech :lang="to" :text="t.normalizedTarget"></Speech>
                        </div>
                        <div>
                            <span>{{ t.posTag }}</span>
                        </div>
                    </div>
                    <div class="tran-item-container">
                        <div v-for="bt in t.backTranslations" :key="bt.normalizedText">
                            <div class="label-container">
                                <span>{{ bt.normalizedText }}</span>
                                <div class="speech-btn">
                                    <Speech :lang="from" :text="bt.normalizedText"></Speech>
                                </div>
                            </div>
                            <div class="example-container">
                                <div class="example-item" v-for="ex in bt.examples" :key="ex.sourcePrefix">
                                    <div class="label-container">
                                        <div>
                                            <span>{{ ex.sourcePrefix }}</span>
                                            <span class="text-strong">{{ ex.sourceTerm }}</span>
                                            <span>{{ ex.sourceSuffix }}</span>
                                        </div>
                                        <div class="speech-btn">
                                            <Speech :lang="from" :text="ex.sourcePrefix + ex.sourceTerm + ex.sourceSuffix">
                                            </Speech>
                                        </div>
                                    </div>
                                    <div class="label-container">
                                        <div>
                                            <span>{{ ex.targetPrefix }}</span>
                                            <span class="text-strong">{{ ex.targetTerm }}</span>
                                            <span>{{ ex.targetSuffix }}</span>
                                        </div>
                                        <div class="speech-btn">
                                            <Speech :lang="to" :text="ex.targetPrefix + ex.targetTerm + ex.targetSuffix">
                                            </Speech>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
    position: relative;
}


.dic-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    grid-gap: var(--grid-gap-10);
    overflow-y: auto;
}

.label-container {
    display: flex;
    grid-gap: var(--grid-gap-10);
    align-items: center;
    cursor: default
}

.speech-btn {
    display: none;
}

.label-container:hover .speech-btn {
    display: block;
}

.trans-container {
    display: flex;
    grid-gap: var(--grid-gap-10);
    flex-direction: column;
    padding-left: 20px;
}


.tran-item-container {
    display: flex;
    grid-gap: var(--grid-gap-10);
    flex-direction: column;
    padding-left: 20px;
}

.example-container {
    padding-left: 20px;
    display: flex;
    grid-gap: var(--grid-gap-10);
    flex-direction: column;
}

.example-item {
    display: flex;
    grid-gap: var(--grid-gap-5);
    flex-direction: column;
}

.text-strong {
    font-weight: var(--default-font-strong-weight);
    margin: 0px 5px;
    font-style: oblique;
}
</style>
