import type { RouteRecordRaw } from 'vue-router'

const ResourceList = () => import('@/components/infr-project/resource/List.vue')
const ResourceEdit = () => import('@/components/infr-project/resource/Edit.vue')
const ResourceDetail = () => import('@/components/infr-project/resource/Detail.vue')


const PlatformList = () => import('@/components/infr-project/platform/PlatformList.vue')
const PlatformDetail = () => import('@/components/infr-project/platform/PlatformDetail.vue')
const PlatformProjectDetail = () => import('@/components/infr-project/platform/ProjectDetail.vue')

const ProjectEdit = () => import('@/components/infr-project/project/Edit.vue')
const ProjectDetail = () => import('@/components/infr-project/project/Detail.vue')
const Projects = () => import('@/components/infr-project/project/List.vue')

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
    {
        path: '/project/edit',
        name: 'ProjectEdit',
        component: ProjectEdit,
    },
    {
        path: '/project',
        name: 'project',
        component: Projects,
    },
    {
        path: '/project/:id',
        name: 'ProjectDetail',
        component: ProjectDetail,
    },
] as RouteRecordRaw[]
