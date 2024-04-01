<script lang="ts" setup>
export interface ImageSvgProps {
    width?: string
    height?: string
    href: string
    title: string
}

const props = withDefaults(defineProps<ImageSvgProps>(), {
    width: "30",
    height: "30"
})

</script>

<template>
    <svg :width="props.width" :height="props.height" xmlns="http://www.w3.org/2000/svg">
        <title v-if="props.title">{{ props.title }}</title>
        <image :href="props.href" :width="props.width" :height="props.height" />
    </svg>
</template>