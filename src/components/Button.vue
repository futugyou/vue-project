<script lang="ts" setup>
import Spinners from '@/components/Spinners.vue'

const emit = defineEmits<{
    (e: 'click'): void
}>()

const props = defineProps<{
    Text?: string
    Position?: "Left" | "Right"
    IsLoading?: boolean
    Disabled?: boolean
}>()

const HandleClick = () => {
    if (!props.IsLoading) {
        emit('click')
    }
}

</script>

<template v-if="!IsLoading">
    <button class="button-base variant-normal" @click="HandleClick" :disabled=Disabled>
        <template v-if="!IsLoading">
            <slot v-if="Position == 'Left'"></slot>
            <span class="button-label" v-if="Text">{{ Text }}</span>
            <slot v-if="Position != 'Left'"></slot>
        </template>
        <Spinners width="20px" height="20px" v-if="IsLoading"></Spinners>
    </button>
    <template v-if="!IsLoading"></template>
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

.button-base[disabled] {
    opacity: 0.3;
}

.button-base:hover {
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

.button-label {
    margin: 0px 10px;
}
</style>