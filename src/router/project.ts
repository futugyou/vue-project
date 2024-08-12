import { RouteRecordRaw } from 'vue-router'

const ResourceList = () => import('@/components/infr-project/resource/List.vue')

export const ProjectRoutes = [
    {
        path: '/resource',
        name: 'Resource',
        component: ResourceList,
    }
] as RouteRecordRaw[]
