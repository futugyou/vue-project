import { RouteRecordRaw } from 'vue-router'

const Account = () => import('@/components/aws/account/Account.vue')
const Parameter = () => import('@/components/aws/parameter/Parameter.vue')
const EcsService = () => import('@/components/aws/ecs/EcsService.vue')
const S3List = () => import('@/components/aws/s3bucket/List.vue')

const AccountDetail = () => import('@/components/aws/account/Detail.vue')
const ParameterDetail = () => import('@/components/aws/parameter/Detail.vue')
const EcsServiceDetail = () => import('@/components/aws/ecs/Detail.vue')

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
    },
    {
        path: '/parameter',
        name: 'Parameter',
        component: Parameter,        
        meta: { requiresAuth: true }
    },
    {
        path: '/parameter/:parameterId',
        name: 'ParameterDetail',
        component: ParameterDetail,        
        meta: { requiresAuth: true }
    },
    {
        path: '/ecs',
        name: 'EcsService',
        component: EcsService,        
        meta: { requiresAuth: true }
    },
    {
        path: '/ecs/:id',
        name: 'EcsServiceDetail',
        component: EcsServiceDetail,        
        meta: { requiresAuth: true }
    },
    {
        path: '/s3',
        name: 'S3Bucket',
        component: S3List,        
        meta: { requiresAuth: true }
    }
] as RouteRecordRaw[]
