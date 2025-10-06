<script lang="ts" setup>
import { ref, watchEffect, watch } from 'vue'
import { getAccounts } from './account'
import type { Account } from './account'

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
const selectedAccount = ref<string>(props.selected)

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

watch(selectedAccount, () => {
    const account = accounts.value.find((item) => item.id == selectedAccount.value)
    if (account) {
        emit('changeAccount', account)
    }
})
</script>

<template>
    <v-select v-model="selectedAccount" :items="accounts" item-title="alias" item-value="id"></v-select>
</template>