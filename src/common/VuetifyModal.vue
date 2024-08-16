<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps({
    text: String,
    title: String,
    hideFooter: Boolean,
    activator: String,
    persistent: Boolean,
    dialog: Boolean,
})

const dialog = ref(props.dialog)

const cancle = () => {
    emit('cancle')
    dialog.value = false
}

const save = () => {
    emit('save')
    dialog.value = false
}

const emit = defineEmits<{
    (e: 'cancle'): void
    (e: 'save'): void
    (e: 'update:dialog', dialog: boolean): void
}>()

watch(() => props.dialog, (newVal) => {
    dialog.value = newVal
})

watch(dialog, (newVal) => {
    emit('update:dialog', newVal)
})

</script>
<template>
    <v-dialog v-model="dialog" max-width="600" :persistent="persistent">
        <template v-slot:activator="{ props: activatorProps }" v-if="!activator">
            <v-btn class="text-none font-weight-regular" :text="text" variant="tonal" v-bind="activatorProps"></v-btn>
        </template>

        <v-card :title="title">
            <slot></slot>

            <v-divider></v-divider>

            <v-card-actions v-if="!!!hideFooter">
                <v-spacer></v-spacer>

                <v-btn text="Close" variant="plain" @click="cancle"></v-btn>

                <v-btn color="primary" text="Save" variant="tonal" @click="save"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>