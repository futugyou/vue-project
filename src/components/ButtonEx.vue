<script lang="ts" setup>
import { useRouter } from 'vue-router'


const props = defineProps<{

}>()

</script>

<template>
    <button class="button-ex variant-normal">
        <span>View</span>
        <span class="button-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
                <path class="stroke-linecap-square" d="M10 2h4v4"></path>
                <path d="m6 10 8-8"></path>
                <path class="stroke-linejoin-round" d="M14 9.048V14H2V2h5"></path>
            </svg>
        </span>
    </button>
</template>

<style scoped >
.button-ex {
    display: flex;
    border-collapse: initial;
    border-spacing: 0;
    caption-side: top;
    cursor: auto;
    direction: ltr;
    empty-cells: show;
    font-family: serif;
    font-size: medium;
    font-style: normal;
    font-feature-settings: normal;
    font-variant: normal;
    font-stretch: normal;
    line-height: normal;
    -webkit-hyphens: none;
    hyphens: none;
    letter-spacing: normal;
    list-style: disc none outside;
    tab-size: 8;
    text-align: left;
    text-align-last: auto;
    text-indent: 0;
    text-shadow: none;
    text-transform: none;
    visibility: visible;
    white-space: normal;
    widows: 2;
    word-spacing: normal;
    box-sizing: border-box;
    font-size: var(--font-size-body-m);
    line-height: var(--line-height-body-m);
    color: var(--color-text-body-default);
    font-weight: 400;
    font-family: var(--font-family-base);
    -webkit-font-smoothing: auto;
    -moz-osx-font-smoothing: auto;
    min-width: 0;
    word-break: break-word;
    font-weight: var(--font-button-weight);
    -webkit-font-smoothing: var(--font-smoothing-webkit);
    -moz-osx-font-smoothing: var(--font-smoothing-moz-osx);
    letter-spacing: var(--font-button-letter-spacing);
    border-start-start-radius: var(--border-radius-button);
    border-start-end-radius: var(--border-radius-button);
    border-end-start-radius: var(--border-radius-button);
    border-end-end-radius: var(--border-radius-button);
    border-block: var(--border-field-width) solid;
    border-inline: var(--border-field-width) solid;
    padding-block: var(--space-scaled-xxs);
    padding-inline: var(--space-button-horizontal);
    text-decoration: none;
    cursor: pointer;
}

.button-ex:hover {
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

.button-icon {
    line-height: 20px;
    width: 16px;
    height: 16px;
    margin-left: 10px;
    position: relative;
}

.button-icon>svg {
    stroke-width: 2px;
    stroke-linecap: square;
    stroke: currentColor;
    pointer-events: none;
    fill: none;
}

.stroke-linecap-square {
    stroke-linecap: square;
}

.stroke-linejoin-round {
    stroke-linejoin: round;
}
</style>