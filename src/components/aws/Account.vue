<script lang="ts" setup>
import { ref, watchEffect } from 'vue';

const accounts = ref([])
const fetchData = async () => {
  const res = await fetch(`https://649e5a1f245f077f3e9c4d44.mockapi.io/api/v1/accounts`)
  accounts.value = await res.json()
}
watchEffect(async () => fetchData())
</script>

<template>
  <div>
    <h1>account</h1>
    <table class="table">
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
          <td>{{ new Date(account.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
