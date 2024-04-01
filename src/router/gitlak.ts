import { RouteRecordRaw } from 'vue-router'

const Gitalk = () => import('@/components/gitalk/Gitalk.vue')

export const GitlakRoutes = [
    {
        path: '/gitalk',
        name: 'Gitalk',
        component: Gitalk,
        props: {
            clientID: import.meta.env.REACT_APP_GITTALK_CLIENTID,
            clientSecret: import.meta.env.REACT_APP_GITTALK_CLIENTSECRET,
            repo: import.meta.env.REACT_APP_GITTALK_REPO,
            owner: import.meta.env.REACT_APP_GITTALK_OWNER,
            issue_number: import.meta.env.REACT_APP_GITTALK_NUMBER
        }
    }
] as RouteRecordRaw[]
