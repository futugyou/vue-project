<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
    text: String,
    title: String,
    hideFooter: Boolean,
})

const dialog = ref(false)

const cancle = () => {
    emit('cancle')
    dialog.value = false
}

const CancleModal = () => {
    dialog.value = false
}
const save = () => {
    emit('save')
    dialog.value = false
}

const emit = defineEmits<{
    (e: 'cancle'): void
    (e: 'save'): void
}>()

defineExpose({
    CancleModal
})

</script>
<template>
    <div class="pa-4 text-center">
        <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
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
    </div>
</template>