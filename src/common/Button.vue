<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Spinners from '@/common/Spinners.vue'

const buttonref = ref<HTMLButtonElement>()
const tipClass = ref("bottom-left")
const emit = defineEmits<{
    (e: 'click'): void
}>()

const props = defineProps<{
    Text?: string
    Position?: "Left" | "Right"
    IsLoading?: boolean
    Disabled?: boolean
    Tip?: string
}>()

const HandleClick = () => {
    if (!props.IsLoading) {
        emit('click')
    }
}

onMounted(() => {
    if (buttonref.value) {
        var rect = buttonref.value.getBoundingClientRect()
        // console.log(rect.top, rect.right, rect.bottom, rect.left)
    }
})
</script>

<template>
    <button ref="buttonref" v-if="Text" class="button-base variant-normal" @click="HandleClick" :disabled=Disabled>
        <template v-if="!IsLoading">
            <div class="icon-base" v-if="Position == 'Left'">
                <slot></slot>
            </div>
            <span class="button-label">{{ Text }}</span>
            <div class="icon-base" v-if="Position == 'Right'">
                <slot></slot>
            </div>
        </template>
        <Spinners :size="20" v-if="IsLoading"></Spinners>
        <span class="tooltiptext" v-if="Tip">{{ Tip }}</span>
    </button>
    <button ref="buttonref" v-if="!Text" class="pure-icon variant-normal" @click="HandleClick" :disabled=Disabled>
        <div class="icon-base" style="margin: 0px;">
            <slot></slot>
        </div>
        <span class="tooltiptext" v-if="Tip" :class="tipClass">{{ Tip }}</span>
    </button>
</template>

<style scoped >
.button-base {
    border-start-start-radius: var(--border-radius-button);
    border-start-end-radius: var(--border-radius-button);
    border-end-start-radius: var(--border-radius-button);
    border-end-end-radius: var(--border-radius-button);
    border-block: var(--border-field-width) solid;
    border-inline: var(--border-field-width) solid;
    border-collapse: initial;
    border-spacing: 0;
    box-sizing: border-box;

    color: var(--color-text-body-default);
    caption-side: top;
    cursor: pointer;
    direction: ltr;
    display: flex;
    empty-cells: show;

    font-family: var(--font-family-base);
    font-feature-settings: normal;
    font-style: normal;
    font-stretch: normal;
    font-size: var(--font-size-body-m);
    font-variant: normal;
    font-weight: var(--font-button-weight);

    hyphens: none;
    line-height: var(--line-height-body-m);
    list-style: disc none outside;
    letter-spacing: var(--font-button-letter-spacing);
    min-width: 0;

    tab-size: 8;
    text-align: left;
    text-align-last: auto;
    text-decoration: none;
    text-indent: 0;
    text-shadow: none;
    text-transform: none;

    visibility: visible;
    white-space: normal;
    widows: 2;
    word-spacing: normal;
    word-break: keep-all;

    padding-block: var(--space-scaled-xxs);
    padding-inline: var(--space-button-horizontal);

    -webkit-font-smoothing: var(--font-smoothing-webkit);
    -moz-osx-font-smoothing: var(--font-smoothing-moz-osx);
    -webkit-hyphens: none;
}

.variant-normal[disabled] {
    opacity: 0.3;
}

.button-base:hover {
    background: var(--color-background-button-normal-hover);
    color: var(--color-text-button-normal-hover);
    border-color: var(--color-border-button-normal-hover);
    text-decoration: none;
}

.pure-icon {
    display: flex;
}

.pure-icon:hover {
    background: var(--color-background-button-normal-hover);
    color: var(--color-text-button-normal-hover);
    border-color: var(--color-border-button-normal-hover);
    text-decoration: none;
}

.variant-normal {
    background: var(--color-background-button-normal-default);
    color: var(--color-text-button-normal-default);
    border-color: var(--color-border-button-normal-default);
    position: relative;
    text-decoration: none;
}

.variant-normal .tooltiptext {
    visibility: hidden;
    background: var(--color-background-button-normal-default);
    color: var(--color-text-button-normal-default);
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    white-space: nowrap;
}

.variant-normal:hover .tooltiptext {
    visibility: visible;
}

.tooltiptext.top-left {
    top: -35px;
    left: -50%;
    text-align: left;
}

.tooltiptext.top-right {
    top: -35px;
    left: 50%;
    text-align: right;
}

.tooltiptext.bottom-left {
    top: calc(100% + 5px);
    left: -50%;
    text-align: left;
}

.tooltiptext.bottom-right {
    top: calc(100% + 5px);
    left: 50%;
    text-align: right;
}

.button-label {
    margin: 0px 10px;
}
</style>