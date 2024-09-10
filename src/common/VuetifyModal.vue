<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps({
    text: String,
    title: String,
    hideFooter: Boolean,
    activator: String,
    persistent: Boolean,
    dialog: Boolean,
    width: Number,
    okText: String,
    cancleText: String
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
    <v-dialog v-model="dialog" :max-width="width" :persistent="persistent">
        <template v-slot:activator="{ props: activatorProps }" v-if="!activator">
            <v-btn class="text-none font-weight-regular" variant="outlined" :text="text" v-bind="activatorProps"></v-btn>
        </template>

        <v-card :title="title">
            <v-card-text>
                <slot></slot>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions v-if="!!!hideFooter">
                <v-spacer></v-spacer>

                <v-btn :text="cancleText ?? 'Close'" @click="cancle"></v-btn>

                <v-btn color="primary" :text="okText ?? 'Save'" @click="save"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>