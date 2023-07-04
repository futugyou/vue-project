<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import moment from 'moment'
import Spinners from '../Spinners.vue'
// import { useFetch } from '@/composables/fetch'

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
const placeholder = ref('no data found')
const accountEndpoint = computed(() => {
  return import.meta.env.REACT_APP_AWS_SERVER + 'v1/accounts?page=' + page.value + '&limit=' + limit.value
})

// const { data, error } = useFetch(accountEndpoint)
// watchEffect(() => {
//   isLoading.value = true
//   if (data.value) {
//     accounts.value = data.value
//     isLoading.value = false
//   }
// })

// watch(error, (d: any) => {
//   if (d) {
//     accounts.value = []
//     placeholder.value = d.value
//     isLoading.value = false
//   }
// })
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
  if (n == -1 && page.value >= 2) {
    page.value = page.value - 1
  }

  if (n == 1 && accounts.value.length != 0) {
    page.value = page.value + 1
  }
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
    <div class="middle-content">
      <div v-if="accounts.length == 0">{{ placeholder }}</div>
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
      </table>
    </div>
    <div class="foot-content">
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
            <li class="page-item" v-if="!(page > 1 && accounts.length == 0)">
              <a class="page-link" href="#" @click="updatePage(1)">{{ page + 1 }}</a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#" @click="updatePage(1)">Next</a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="dropdown" style="margin-left: 20px;">
        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          {{ limit }}
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
.full-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.head-content {}

.middle-content {
  flex: 1;
  overflow: auto;
  margin-bottom: 10px;
}

.foot-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
