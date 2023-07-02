<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
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

const fetchData = async () => {
  isLoading.value = true
  const res = await fetch(`https://649e5a1f245f077f3e9c4d44.mockapi.io/api/v1/accounts`)
  accounts.value = await res.json()
  // mock delay
  await new Promise((resolve) => setTimeout(resolve, 5000))
  isLoading.value = false
}

watchEffect(async () => fetchData())

const timeFormat = (timestamp: number): string => {
  var day = moment(timestamp)
  return day.format('lll')
}
</script>

<template>
  <div>
    <h1>account</h1>
    <div v-if="accounts.length == 0">no data found</div>
    <Spinners v-else-if="isLoading"> </Spinners>
    <table class="table" v-else>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Alias</th>
          <th scope="col">AccessKeyId</th>
          <th scope="col">SecretAccessKey</th>
          <th scope="col">Region</th>
          <th scope="col">CreatedAt</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="account in accounts" :key="account.id">
          <th scope="row">{{ account.id }}</th>
          <td>{{ account.alias }}</td>
          <td>{{ account.accessKeyId }}</td>
          <td>{{ account.secretAccessKey }}</td>
          <td>{{ account.region }}</td>
          <td>{{ timeFormat(account.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
