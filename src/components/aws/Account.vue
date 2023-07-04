<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import moment from 'moment'
import TableAndPaging from '../TableAndPaging.vue'

interface Account {
  id: string
  alias: string
  accessKeyId: string
  secretAccessKey: string
  region: string
  createdAt: number
}

const accounts = ref<Account[]>([])
const isLoading = ref(true)
const limit = ref(10)
const page = ref(1)

const accountEndpoint = computed(() => {
  return (
    import.meta.env.REACT_APP_AWS_SERVER +
    'v1/accounts?page=' +
    page.value +
    '&limit=' +
    limit.value
  )
})

const fetchData = async () => {
  isLoading.value = true
  const res = await fetch(accountEndpoint.value)
  accounts.value = await res.json()
  // // mock delay
  // await new Promise((resolve) => setTimeout(resolve, 5000))
  isLoading.value = false
}

watchEffect(async () => fetchData())

const timeFormat = (timestamp: number): string => {
  var day = moment(timestamp)
  return day.format('lll')
}

const updatePage = (n: number) => {
  page.value = n
}

const changePagesize = (n: number) => {
  limit.value = n
}
</script>

<template>
  <div class="full-content">
    <div class="head-content">
      <h1>account</h1>
    </div>
    <TableAndPaging
      :items="accounts"
      :isLoading="isLoading"
      @changePagesize="changePagesize"
      @updatePage="updatePage"
    >
      <template v-slot:th>
        <th scope="col">#</th>
        <th scope="col">Alias</th>
        <th scope="col">AccessKeyId</th>
        <th scope="col">SecretAccessKey</th>
        <th scope="col">Region</th>
        <th scope="col">CreatedAt</th>
      </template>
      <template v-slot:td="account">
        <th class="table-info">{{ account.id }}</th>
        <td>{{ account.alias }}</td>
        <td>{{ account.accessKeyId }}</td>
        <td>{{ account.secretAccessKey }}</td>
        <td>{{ account.region }}</td>
        <td>{{ timeFormat(account.createdAt) }}</td>
      </template>
    </TableAndPaging>
  </div>
</template>

<style scoped>
.full-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.head-content {
  display: flex;
}
</style>
