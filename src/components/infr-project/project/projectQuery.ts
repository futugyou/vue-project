
import { ref } from 'vue'

import { useBaseQuery } from '@/composables/useBaseQuery'
import { ProjectApiFactory } from './project'
import type { ProjectView } from './project'

export const useProjects = (alertError: boolean = true) => {
    return useBaseQuery<ProjectView[]>(
        ['projectList'],
        async () => {
            const { data, error } = await ProjectApiFactory().v1ProjectGet()
            if (error) throw error
            return data ?? []
        },
        {
            alertError,
            idbName: 'project',
            idbStoreName: 'datas',
        }
    )
}

export const useProject = (projectId: string, alertError: boolean = true) => {
    return useBaseQuery<ProjectView>(
        ['project', projectId],
        async () => {
            const { data, error } = await ProjectApiFactory().v1ProjectIdGet(projectId)
            if (error) throw error
            return data!
        },
        {
            alertError,
            idbName: 'project',
            idbStoreName: 'datas',
        }
    )
}
