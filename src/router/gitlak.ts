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
            // ??? 
            // [Vue warn]: Invalid prop: type check failed for prop "issue_number". Expected Number with value 1, got String with value "1". 
            issue_number: parseInt(import.meta.env.REACT_APP_GITTALK_NUMBER + ""),
            per_page: parseInt(import.meta.env.REACT_APP_GITTALK_PRE_PAGE + ""),
        }
    }
] as RouteRecordRaw[]
