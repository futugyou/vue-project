<script lang="ts" setup>
import { defineComponent, ref, computed } from 'vue'
import Up from '@/icons/Up.vue'
import Down from '@/icons/Down.vue'

export interface IDropdownProps {
    items: Record<string, string>
    defaultValue?: string
    allowEmpty?: boolean
}

const props = defineProps<IDropdownProps>()
const emit = defineEmits<{
    (e: 'changeSelected', n: string): void
}>()

const selectedValue = ref(props.items[props.defaultValue ?? ""] ?? "---")

const items = computed(() => {
    if (props.allowEmpty) {
        return { "": "---", ...props.items }
    }
    return props.items
})

const showList = ref(false)
const changeSelected = (key: string) => {
    const selectItem = items.value[key]
    if (selectItem) {
        selectedValue.value = selectItem
    } else {
        selectedValue.value = ""
    }

    showList.value = false
    emit('changeSelected', key)
}
</script>

<template>
    <div class="dropdown-container">
        <div>
            <button type="button" class="dropdown-btn" @click="showList = !showList">
                <span>{{ selectedValue }}</span>

                <Up v-if="showList"></Up>
                <Down v-if="!showList"></Down>
            </button>
        </div>

        <div class="dropdown-items-container">
            <ul v-if="showList">
                <li v-for="(value, key) in items" :key="key" @click="changeSelected(key)">{{ value }}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.dropdown-container {
    position: relative;
    white-space: nowrap;
    width: 100%;
}

.dropdown-items-container {
    position: absolute;
    width: 100%;
    text-align: left;
    line-height: 30px;
    margin-top: 5px;
    z-index: 1;
    border-radius: 10px;
    background: fixed;
    background-color: rgba(255, 255, 255);
}

.dropdown-btn {
    border: 1px solid var(--color-border-button-normal-default);
    border-radius: 10px;
    padding: 0px 10px;
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
}

.dropdown-btn svg {
    width: 20px;
    height: 20px;
}

.dropdown-items-container ul {
    border: 1px solid var(--color-border-button-normal-default);
    border-radius: 10px;
    margin: 0;
    padding: 0;
}

.dropdown-items-container * li {
    cursor: pointer;
    padding-left: 10px;
    border-radius: 10px;
}


.dropdown-items-container * li:hover {
    background-color: var(--color-background-dropdown-normal-hover);
}
</style>