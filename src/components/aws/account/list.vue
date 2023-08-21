<script lang="ts" setup>
import { ref, watchEffect, computed, onMounted, watch } from 'vue'
import { Account, defaultAccount, getAccounts } from './account'

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

const accounts = ref<Account[]>([])

const fetchData = async () => {
    const { data, error } = await getAccounts()
    if (error) {
        console.log(error.message)
        return
    }

    accounts.value = data ?? []
}

watchEffect(async () => fetchData())

const emit = defineEmits<{
    (e: 'changeAccount', acc: Account): void
}>()

const changeRegion = (acc: Account) => {
    emit('changeAccount', acc)
}

const selectedAccount = computed(() => {
    return accounts.value.find((item) => item.id == props.selected)
})
</script>


<template>
    <div class="dropdown-center" style="width: 100%;">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"
            data-bs-display="static" style="width: 100%;">
            {{ (selectedAccount ?? defaultAccount).alias?.length > 0 ? selectedAccount?.alias : '--choose a item--' }}
        </button>
        <ul class="dropdown-menu">
            <li>
                <a class="dropdown-item" href="#" @click="changeRegion(defaultAccount)" :class="{ active: '' == selected }">
                    --choose a item--
                </a>
            </li>
            <li key="item" v-for="item in accounts">
                <a class="dropdown-item" href="#" @click="changeRegion(item)" :class="{ active: item.id == selected }">
                    {{ item.alias }}
                </a>
            </li>
        </ul>
    </div>
</template>