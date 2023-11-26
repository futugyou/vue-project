<script lang="ts" setup>
import { useRouter } from 'vue-router'

export interface BreadcrumbItem {
    key: string
    text: string
}

const router = useRouter()

const props = defineProps<{
    items: BreadcrumbItem[],
    action?: (key: string) => void,
}>()

const handlerClick = (key: string) => {
    if (props.action) {
        props.action(key)
    } else {
        router.push(key)
    }
}

</script>

<template>
    <div class="crumbContainer">
        <div class="link" v-for="field in props.items">
            <span @click="handlerClick(field.key)">{{ field.text }}</span>
        </div>
    </div>
</template>

<style scoped >
.crumbContainer {
    display: flex;
    grid-gap: 35px;
    padding: 5px;
    padding-left: 0px;
    line-height: 30px;
}

.link {
    color: var(--color-text-link-default, #0972d3);
    text-underline-offset: 0.25em;
    text-decoration-thickness: 1px;
    text-decoration-line: underline;
    text-decoration-color: initial;
    cursor: pointer;
    position: relative;
}

.link::after {
    content: " >";
    position: absolute;
    right: -25px;
    font-size: 20px;
    cursor: default;
    pointer-events: none;
    color: var(--color-text-breadcrumb-spilt, #5f6b7a);
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