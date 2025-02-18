import { RouteRecordRaw } from 'vue-router'

const ResourceList = () => import('@/components/infr-project/resource/List.vue')
const ResourceEdit = () => import('@/components/infr-project/resource/Edit.vue')
const ResourceDetail = () => import('@/components/infr-project/resource/Detail.vue')


const PlatformList = () => import('@/components/infr-project/platform/PlatformList.vue')
const PlatformDetail = () => import('@/components/infr-project/platform/PlatformDetail.vue')
const PlatformProjectDetail = () => import('@/components/infr-project/platform/ProjectDetail.vue')


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
        path: '/resource/edit',
        name: 'ResourceEdit',
        component: ResourceEdit,
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
        path: '/platform/:id/:projectId',
        name: 'PlatformProjectDetail',
        component: PlatformProjectDetail,
    },
    {
        path: '/vault',
        name: 'Vault',
        component: VaultList,
    },
] as RouteRecordRaw[]
