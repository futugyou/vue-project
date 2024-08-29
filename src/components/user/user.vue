<script lang="ts" setup>
import { ref, computed, } from 'vue'

import { useAuth } from '@/plugins/auth'

const authService = useAuth()

const authStatus = computed(() => authService.isAuthenticated())

const authUser = computed(() => authService.getUser())

const login = async () => {
    authService.authorize()
}

const logout = async () => {
    authService.logout()
}

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