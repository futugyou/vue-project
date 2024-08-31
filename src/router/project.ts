import { RouteRecordRaw } from 'vue-router'

const ResourceList = () => import('@/components/infr-project/resource/List.vue')
const ResourceDetail = () => import('@/components/infr-project/resource/Detail.vue')


const PlatformList = () => import('@/components/infr-project/platform/List.vue')

export const ProjectRoutes = [
    {
        path: '/resource',
        name: 'Resource',
        component: ResourceList,
    },
    {
        path: '/resource/:id',
        name: 'ResourceDetai',
        component: ResourceDetail,
    },
    {
        path: '/platform',
        name: 'Platform',
        component: PlatformList,
    },
] as RouteRecordRaw[]
