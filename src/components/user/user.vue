<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useAuth } from '@/plugins/auth'

const router = useRouter()
const route = useRoute()

const authService = useAuth()

const authStatus = ref(false)

const checkAuth = () => {
    authStatus.value = authService.isAuthenticated()
}
const login = async () => {
    authService.authorize()
    checkAuth()
}

const logout = async () => {
    await authService.logout()

    checkAuth()

    if (route.meta.requiresAuth) {
        router.push({ name: 'Home' });
    }
}

onMounted(() => {
    checkAuth()
    window.addEventListener('storage', checkAuth)
})

onBeforeUnmount(() => {
    window.removeEventListener('storage', checkAuth)
})

</script>

<template>
    <v-sheet class="d-flex align-center justify-center pr-3 pl-3" height="100%">
        <v-hover v-if="authStatus">
            <template v-slot:default="{ isHovering, props }">
                <v-avatar v-bind="props">
                    <v-icon icon="md:face" v-if="!isHovering"></v-icon>
                    <v-icon icon="md:logout" v-if="isHovering" @click="logout"></v-icon>
                </v-avatar>
            </template>
        </v-hover>

        <v-btn variant="outlined" @click="login" text="Login" v-else>
            <template v-slot:append>
                <v-icon icon="md:login"></v-icon>
            </template>
        </v-btn>
    </v-sheet>
</template>