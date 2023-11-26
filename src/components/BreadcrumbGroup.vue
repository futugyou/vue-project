<script lang="ts" setup>

export interface BreadcrumbItem {
    text: string
    key: string
}

const props = defineProps<{
    items: BreadcrumbItem[],
    action?: () => void,
}>()

</script>

<template>
    <div class="crumbContainer">
        <div class="link" v-for="field in props.items">
            {{ field.text }}
        </div>
    </div>
</template>

<style scoped >
.crumbContainer {
    display: flex;
    grid-gap: 20px;
    padding: 5px;
    padding-left: 0px;
}

.link {
    color: var(--color-text-link-default, #0972d3);
    text-underline-offset: 0.25em;
    text-decoration-thickness: 1px;
    text-decoration-line: underline;
    text-decoration-color: initial;
    cursor: pointer;
}

.link::after {
    content: " >";
}

.link:last-child {
    text-decoration-line: none;
    cursor: default;
    font-weight: 700;
    color: var(--color-text-breadcrumb-current-bnqeha, #5f6b7a);
}

.link:last-child::after {
    content: none;
}
</style>