<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue'
import moment from 'moment'

import Spinners from '../Spinners.vue'

interface Account {
  id: string
  alias: string
  accessKeyId: string
  secretAccessKey: string
  region: string
  createdAt: number
}

const accounts = ref<Account[]>([])
const isLoading = ref(false)
const limit = ref(10)
const page = ref(1)
const accountEndpoint = computed(() => {
  return import.meta.env.REACT_APP_AWS_SERVER + 'v1/accounts?page=' + page.value + '&limit=' + limit.value
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
  if (n == -1 && page.value > 2) {
    page.value = page.value - 1
  }

  if (n == 1) {
    page.value = page.value + 1
  }
}
</script>

<template>
  <div>
    <h1>account</h1>
    <div v-if="accounts.length == 0">no data found</div>
    <Spinners v-else-if="isLoading"> </Spinners>
    <table class="table table-striped table-hover" v-else>
      <thead>
        <tr class="table-dark">
          <th scope="col">#</th>
          <th scope="col">Alias</th>
          <th scope="col">AccessKeyId</th>
          <th scope="col">SecretAccessKey</th>
          <th scope="col">Region</th>
          <th scope="col">CreatedAt</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(account, index) in accounts" :key="account.id" class="table-primary">
          <th scope="row" class="table-info">{{ account.id }}</th>
          <td>{{ account.alias }}</td>
          <td>{{ account.accessKeyId }}</td>
          <td>{{ account.secretAccessKey }}</td>
          <td>{{ account.region }}</td>
          <td>{{ timeFormat(account.createdAt) }}</td>
        </tr>
      </tbody>

      <button @click="updatePage(-1)">page up</button>
      <button @click="updatePage(1)">page down</button>
    </table>
  </div>
</template>
