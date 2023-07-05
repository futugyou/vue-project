<script lang="ts" setup>
import { ref, PropType } from 'vue'
import Spinners from './Spinners.vue'

export interface TableField {
    key: string
    label: string
    header?: boolean
    format?: (x: any) => string
}

const props = defineProps({
    fields: { type: Array as PropType<TableField[]>, default: () => [] },
    items: { type: Array, default: () => [] },
    isLoading: Boolean
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

const pagesize = ref(10)
const page = ref(1)
const placeholder = ref('no data found')

const updatePage = (n: number) => {
    if (n == -1 && page.value >= 2) {
        page.value = page.value - 1
    }

    if (n == 1 && props.items!.length != 0) {
        page.value = page.value + 1
    }

    emit('updatePage', page.value)
}

const changePagesize = (n: number) => {
    pagesize.value = n
    emit('changePagesize', pagesize.value)
    page.value = 1
    emit('updatePage', 1)
}
</script>

<template>
    <div class="table-paging-container">
        <div class="table-container">
            <div v-if="items!.length == 0">{{ placeholder }}</div>
            <Spinners v-else-if="isLoading"> </Spinners>
            <table class="table table-striped table-hover" v-else>
                <thead>
                    <tr class="table-dark">
                        <th scope="col" v-for="field in fields">
                            <slot :name="`header_${field.key}`" v-bind="field">
                                {{ field.label }}
                            </slot>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in items" :key="index" class="table-primary">
                        <template v-for="field in fields">
                            <Component :is="cellElement(field.key)"
                                :class="{ 'table-info': cellElement(field.key) == 'th' }">
                                <slot :name="`body_${field}`" v-bind="item">
                                    {{ format(item, field.key) }}
                                </slot>
                            </Component>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="paging-container">
            <div>
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li class="page-item">
                            <a class="page-link" href="#" @click="updatePage(-1)">Previous</a>
                        </li>
                        <li class="page-item" v-if="page != 1">
                            <a class="page-link" href="#" @click="updatePage(-1)">{{ page - 1 }}</a>
                        </li>
                        <li class="page-item active" aria-current="page">
                            <span class="page-link">{{ page }}</span>
                        </li>
                        <li class="page-item" v-if="pagesize == items!.length">
                            <a class="page-link" href="#" @click="updatePage(1)">{{ page + 1 }}</a>
                        </li>
                        <li class="page-item">
                            <a class="page-link" href="#" @click="updatePage(1)" v-if="pagesize == items!.length">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="dropdown" style="margin-left: 20px">
                <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    {{ pagesize }}
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" @click="changePagesize(10)">10</a></li>
                    <li><a class="dropdown-item" href="#" @click="changePagesize(20)">20</a></li>
                    <li><a class="dropdown-item" href="#" @click="changePagesize(30)">30</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.table-paging-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.table-container {
    flex: 1;
    overflow: auto;
    margin-bottom: 10px;
}

.paging-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
}
</style>
