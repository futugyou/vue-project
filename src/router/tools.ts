import type { RouteRecordRaw } from 'vue-router'

const PdfViewer = () => import('@/components/tools/PdfViewer.vue')
const Translate  = () => import('@/components/tools/translate/Translate.vue')
const Ocr = () => import('@/components/tools/Ocr.vue')
const Drawio = () => import('@/components/tools/Drawio.vue')

export const ToolsRoutes = [
    {
        path: '/ocr',
        name: 'Ocr',
        component: Ocr,
    },
    {
        path: '/translate',
        name: 'Translate',
        component: Translate,
    },
    {
        path: '/pdf',
        name: 'PDF',
        component: PdfViewer,
    },
    {
        path: '/drawio',
        name: 'Drawio',
        component: Drawio,
    }
] as RouteRecordRaw[]
