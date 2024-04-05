import { RouteRecordRaw } from 'vue-router'

const EmbedDrawio = () => import('@/components/drawio/EmbedDrawio.vue')

export const DrawioRoutes = [
    {
        path: '/drawio',
        name: 'Drawio',
        component: EmbedDrawio,
        props: {
            urlParameters: {
                ui: 'kennedy',
                spin: true,
                libraries: true,
                saveAndExit: true
            },
        }
    }
] as RouteRecordRaw[]
