import { RouteRecordRaw } from 'vue-router'

const Account = () => import('@/components/aws/account/Account.vue')
const AccountDetail = () => import('@/components/aws/account/AccountDetail.vue')

export const AwsRoutes = [
    {
        path: '/account',
        name: 'Account',
        component: Account
    },
    {
        path: '/account/:accountId',
        name: 'AccountDetail',
        component: AccountDetail
    }
] as RouteRecordRaw[]
