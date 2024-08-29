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
    <v-sheet class="d-flex align-center justify-center pr-3 pl-3" height="100%">
        <div v-if="authStatus">
            <span>{{ authUser?.name }}</span>
        </div>
        <v-btn variant="outlined" @click="login" text="Login" v-else>
            <template v-slot:append>
                <v-icon icon="md:login"></v-icon>
            </template>
        </v-btn>
    </v-sheet>
</template>