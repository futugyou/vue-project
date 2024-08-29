<script lang="ts" setup>
import { ref, computed, } from 'vue'

import { useAuth } from '@/plugins/auth'

const authService = useAuth()

const authStatus = computed(() => authService.isAuthenticated())

const authUser = computed(() => authService.getUser())

const login = async () => {
    authService.authorize()
}

</script>

<template>
    <v-sheet class="d-flex flex-column align-center overflow-y-auto" height="100%">
        <div v-if="authStatus">
            <span>{{ authUser?.name }}</span>
        </div>
        <div v-else>
            <v-btn @click="login">Login</v-btn>
        </div>
    </v-sheet>
</template>