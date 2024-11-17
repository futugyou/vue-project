import { RouteRecordRaw } from 'vue-router'

const ResourceList = () => import('@/components/infr-project/resource/List.vue')
const ResourceDetail = () => import('@/components/infr-project/resource/Detail.vue')


const PlatformList = () => import('@/components/infr-project/platform/List.vue')
const PlatformDetail = () => import('@/components/infr-project/platform/Detail.vue')


const VaultList = () => import('@/components/infr-project/vault/List.vue')

export const ProjectRoutes = [
    {
        path: '/resource',
        name: 'Resource',
        component: ResourceList,
    },
    {
        path: '/resource/:id',
        name: 'ResourceDetail',
        component: ResourceDetail,
    },
    {
        path: '/platform',
        name: 'Platform',
        component: PlatformList,
    },
    {
        path: '/platform/:id',
        name: 'PlatformDetail',
        component: PlatformDetail,
    },
    {
        path: '/vault',
        name: 'Vault',
        component: VaultList,
    },
] as RouteRecordRaw[]
