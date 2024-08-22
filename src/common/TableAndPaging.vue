<script lang="ts" setup>
import { ref, PropType, computed, watch } from 'vue'

import Empty from '@/common/EmptyStates.vue'

export interface TableField {
    key: string
    label: string
    header?: boolean
    format?: (x: any) => string
}

const props = defineProps({
    fields: { type: Array as PropType<TableField[]>, default: () => [] },
    items: { type: Array, default: () => [] },
    isLoading: Boolean,
    pagesize: { type: Number, default: () => 30 },
    canChangePageSize: { type: Boolean, default: () => true },
})

const format = (item: any, key: string) => {
    const field = props.fields.find((f) => f.key === key)
    return field && field.format ? field.format(item[key]) : item[key]
}

const cellElement = (key: string) => {
    const field = props.fields.find((f) => f.key === key)
    return field && field.header ? 'th' : 'td'
}

const emit = defineEmits<{
    (e: 'updatePage', n: number): void
    (e: 'changePagesize', n: number): void
}>()

const pagesize = ref(props.pagesize)
const page = ref(1)

const updatePage = (n: number) => {
    if (n == -1 && page.value >= 2) {
        page.value = page.value - 1
    }

    if (n == 1 && props.items!.length != 0) {
        page.value = page.value + 1
    }

    emit('updatePage', page.value)
}

const sortKey = ref('')
const sorydir = ref('asc')

const changePagesize = (n: number) => {
    pagesize.value = n
    emit('changePagesize', pagesize.value)
    page.value = 1
    emit('updatePage', 1)
}

const sortedItems = computed<any[]>(() => {
    if (sortKey.value == '') {
        return props.items
    }

    return props.items.sort((a: any, b: any) => {
        if (isNaN(a[sortKey.value])) {
            if (sorydir.value == 'asc') {
                if (a[sortKey.value] >= b[sortKey.value]) {
                    return 1
                } else {
                    return -1
                }
            } else {
                if (a[sortKey.value] <= b[sortKey.value]) {
                    return 1
                } else {
                    return -1
                }
            }
        } else {
            if (sorydir.value == 'asc') {
                return parseFloat(a[sortKey.value]) - parseFloat(b[sortKey.value])
            } else {
                return parseFloat(b[sortKey.value]) - parseFloat(a[sortKey.value])
            }
        }
    })
})

const sort = (key: string) => {
    if (key == sortKey.value) {
        if (sorydir.value == 'asc') {
            sorydir.value = 'desc'
        } else {
            sorydir.value = 'asc'
        }
    } else {
        sorydir.value = 'asc'
    }

    sortKey.value = key
}

watch(pagesize, () => {
    changePagesize(pagesize.value)
})

</script>

<template>
    <v-sheet class="d-flex flex-column overflow-hidden" height="100%">
        <v-sheet class="flex-1-1 mb-2 overflow-auto" height="100%" min-height="40vh">
            <Empty v-if="sortedItems!.length == 0 && !isLoading"></Empty>
            <v-skeleton-loader :elevation="2" :loading="isLoading" type="table">
                <v-table hover class="w-100" v-if="sortedItems!.length != 0">
                    <thead>
                        <tr>
                            <th class="text-left" v-for="field in fields" @click="sort(field.key)">
                                <slot :name="`header_${field.key}`" v-bind="field">
                                    {{ field.label }}
                                </slot>
                                <v-icon icon="md:arrow_drop_down" v-if="sortKey == field.key && sorydir == 'desc'"></v-icon>
                                <v-icon icon="md:arrow_drop_up" v-if="sortKey == field.key && sorydir == 'asc'"></v-icon>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in sortedItems" :key="index" class="text-left">
                            <template v-for="field in fields">
                                <Component :is="cellElement(field.key)"
                                    :class="{ 'table-info': cellElement(field.key) == 'th' }">
                                    <slot :name="`body_${field.key}`" v-bind="item">
                                        {{ format(item, field.key) }}
                                    </slot>
                                </Component>
                            </template>
                        </tr>
                    </tbody>
                </v-table>
            </v-skeleton-loader>
        </v-sheet>
        <v-sheet class="d-flex justify-center">
            <div>
                <nav class="v-pagination v-theme--light" role="navigation" aria-label="Pagination Navigation"
                    data-test="v-pagination-root">
                    <ul class="v-pagination__list">
                        <li class="v-pagination__prev">
                            <a class="page-link" href="#" @click="updatePage(-1)">Prev</a>
                        </li>
                        <li class="v-pagination__item" v-if="page != 1">
                            <a class="page-link" href="#" @click="updatePage(-1)">{{ page - 1 }}</a>
                        </li>
                        <li class="v-pagination__item v-pagination__item--is-active" aria-current="page">
                            <span class="page-link">{{ page }}</span>
                        </li>
                        <li class="v-pagination__item" v-if="pagesize == sortedItems!.length">
                            <a class="page-link" href="#" @click="updatePage(1)">{{ page + 1 }}</a>
                        </li>
                        <li class="v-pagination__next">
                            <a class="page-link" href="#" @click="updatePage(1)"
                                v-if="pagesize == sortedItems!.length">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div style="margin-left: 20px;display: flex;align-items: center;" v-if="canChangePageSize">
                <v-select v-model="pagesize" :items="[10, 20, 30, 50]"></v-select>
            </div>
        </v-sheet>
    </v-sheet>
</template>

<style scoped>
td,
th {
    vertical-align: middle;
}

.page-link {
    display: flex;
    width: 48px;
    height: 48px;
    justify-content: center;
    align-items: center;
}
</style>
