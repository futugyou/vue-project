<script lang="ts" setup>
import { ref, watch } from 'vue'
import { getRegions } from '@/tools/regions'

const props = withDefaults(
    defineProps<{
        selected?: string
    }>(),
    {
        selected: () => {
            return ''
        }
    }
)

const selected = ref(props.selected)

const emit = defineEmits<{
    (e: 'changeRegion', key: string): void
}>()

watch(selected, () => {
    emit('changeRegion', selected.value)
})
</script>


<template>
    <v-select v-model="selected" :items="getRegions()" variant="outlined" :center-affix="true" density="compact"
        :hide-details="true"></v-select>
</template>