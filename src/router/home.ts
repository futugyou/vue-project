import type { RouteRecordRaw } from 'vue-router'

const Home = () => import('@/components/home/Home.vue')
const Gitalk = () => import('@/components/home/MessageBoard.vue')

export const HomeRoutes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { transition: 'slide-fade' }
    },
    {
        path: '/gitalk',
        name: 'Gitalk',
        component: Gitalk,
    }
] as RouteRecordRaw[]
