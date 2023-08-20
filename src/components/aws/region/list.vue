<script lang="ts" setup>
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

const emit = defineEmits<{
    (e: 'changeRegion', key: string): void
}>()


const regionList = getRegions().map((item) => {
    return {
        key: item,
        value: item
    }
})


const changeRegion = (key: string) => {
    emit('changeRegion', key)
}

</script>


<template>
    <div class="dropdown-center" style="width: 100%;">
        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"
            data-bs-display="static" style="width: 100%;">
            {{ selected.length > 0 ? selected : '--choose a item--' }}
        </button>
        <ul class="dropdown-menu">
            <li v-for="item in regionList">
                <a class="dropdown-item" href="#" @click="changeRegion(item.key)" :class="{ active: item.key == selected }">
                    {{ item.value }}
                </a>
            </li>
        </ul>
    </div>
</template>