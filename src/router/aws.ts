import { RouteRecordRaw } from 'vue-router'

const Account = () => import('@/components/aws/account/Account.vue')
const AccountDetail = () => import('@/components/aws/account/Detail.vue')

export const AwsRoutes = [
    {
        path: '/account',
        name: 'Account',
        component: Account,        
        meta: { requiresAuth: true }
    },
    {
        path: '/account/:accountId',
        name: 'AccountDetail',
        component: AccountDetail,
        meta: { requiresAuth: true }
    }
] as RouteRecordRaw[]
