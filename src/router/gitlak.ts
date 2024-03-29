import { RouteRecordRaw } from 'vue-router'
 
const Gitalk = () => import('@/components/gitalk/Gitalk.vue')

export const GitlakRoutes = [
    {
        path: '/gitalk',
        name: 'Gitalk',
        component: Gitalk,
    } 
] as RouteRecordRaw[]
