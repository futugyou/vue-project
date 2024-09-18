<script lang="ts" setup>
</script>

<template>
    <v-empty-state icon="md:search"
        text="Try adjusting your search terms or filters. Sometimes less specific terms or broader queries can help you find what you're looking for."
        title="We couldn't find a match.">
        <template v-if="$slots.default" v-slot:actions>
            <v-spacer></v-spacer>

            <slot></slot>

            <v-spacer></v-spacer>
        </template>
    </v-empty-state>
</template>
