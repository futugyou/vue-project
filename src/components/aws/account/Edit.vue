<script lang="ts" setup>
import { ref, watchEffect, computed, watch } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

import Spinners from '@/components/Spinners.vue'
import { useTimeFormat } from '@/composables/timeFormat'
import { Account, defaultAccount } from './account'

const router = useRouter()
const route = useRoute()

const props = withDefaults(defineProps<{
    account?: Account,
    fromModal: boolean
}>(), {
    account: () => defaultAccount,
    fromModal: () => false
})

const emit = defineEmits<{
    (e: 'save'): void
    (e: 'close'): void
}>()

const isLoading = ref(false)
const account = ref<Account>(props.account)

const accountCreateEndpoint = import.meta.env.REACT_APP_AWS_SERVER + 'v1/accounts'

const save = () => {
    fetch(accountCreateEndpoint, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(account.value)
    })
        .then(response => response.text())
        .then(data => {
            const elements = document.getElementsByClassName('modal-backdrop fade show')
            while (elements.length > 0) {
                elements[0]!.parentNode!.removeChild(elements[0]);
            }

            Array.from(document.querySelectorAll('.modal.fade.show')).forEach(
                (el) => el.classList.remove('show')
            )
            console.log(data);
            const newdata = JSON.parse(data) as Account
            const newrouter = router.resolve({
                name: 'AccountDetail',
                params: { accountId: newdata.id },
            }).href
            router.push(newrouter)
        });
    // emit('save')
}

const close = () => {
    // emit('close')
}

defineExpose({
    save,
    close
})
</script>

<template>
    <div class="full-content">
        <Spinners v-if="isLoading"></Spinners>
        <div v-if="!isLoading" class="detail-container">
            <div class="detail-item" v-if="account?.id">
                <div class="detail-item-lable">ID</div>
                <div class="detail-item-content">{{ account?.id }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Region</div>
                <div class="detail-item-content">
                    <input v-model="account.region" />
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">Alias</div>
                <div class="detail-item-content">
                    <input v-model="account.alias" />
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">AccessKeyId</div>
                <div class="detail-item-content">
                    <input v-model="account.accessKeyId" />
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">SecretAccessKey</div>
                <div class="detail-item-content">
                    <input v-model="account.secretAccessKey" />
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-lable">CreatedAt</div>
                <div class="detail-item-content">
                    {{ account ? useTimeFormat(account.createdAt) : '' }}
                </div>
            </div>
            <div class="button-container" v-if="!fromModal">
                <button type="button" class="btn btn-secondary" @click="close">
                    Close
                </button>
                <button type="button" class="btn btn-primary" @click="save">
                    Save changes
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.full-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.detail-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-align: left;
    max-width: 600px;
    width: 100%;
    font-size: 18px;
    background-color: aliceblue;
}

.detail-item {
    display: flex;
    flex-direction: row;
    height: 60px;
}

.detail-item-lable {
    flex: 1;
    display: flex;
    line-height: 18px;
    padding: 5px;
    margin: 5px;
    height: 40px;
    background-color: #e2f7f0;
    border-radius: 10px;
    align-content: center;
    flex-wrap: wrap;
}

.detail-item-content {
    flex: 1;
    display: flex;
    line-height: 18px;
    padding: 5px;
    margin: 5px;
    height: 40px;
    border-radius: 10px;
    align-content: center;
    flex-wrap: wrap;
}

.button-container {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
}

.button-container>button {
    margin: 5px;
}
</style>
