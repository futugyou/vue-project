import { AuthService } from '@/tools/auth'
import { App, inject, provide } from 'vue'

export const AuthKey = Symbol('AuthService')

export const createAuthPlugin = (authService: AuthService) => {
    return {
        install(app: App) {
            app.provide(AuthKey, authService)
        },
    }
}

export const useAuth = (): AuthService => {
    const authService = inject<AuthService>(AuthKey)
    if (!authService) {
        throw new Error('useAuth must be used within the AuthPlugin')
    }
    return authService
}
