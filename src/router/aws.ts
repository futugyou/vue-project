import { RouteRecordRaw } from 'vue-router'

const Account = () => import('../components/aws/Account.vue')

export const AwsRoutes = [
  {
    path: '/account',
    name: 'Account',
    component: Account
  }
] as RouteRecordRaw[]
