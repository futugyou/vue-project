import { RouteRecordRaw } from 'vue-router'

const PdfViewer = () => import('@/components/tools/PdfViewer.vue')
const Translate  = () => import('@/components/tools/translate/Translate.vue')
const Ocr = () => import('@/components/tools/Ocr.vue')

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
    }
] as RouteRecordRaw[]
