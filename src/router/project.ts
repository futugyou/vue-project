import { RouteRecordRaw } from 'vue-router'

const ResourceList = () => import('@/components/infr-project/resource/List.vue')
const ResourceDetail = () => import('@/components/infr-project/resource/Detail.vue')

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
    }
] as RouteRecordRaw[]
