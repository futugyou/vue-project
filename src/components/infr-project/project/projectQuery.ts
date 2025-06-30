
import { ref } from 'vue'

import { useBaseQuery, useBaseMutation } from '@/composables/useBaseQuery'
import { ProjectApiFactory } from './project'
import type { ProjectView, CreateProjectRequest, UpdateProjectRequest, UpdateProjectPlatformRequest, UpdateProjectDesignRequest } from './project'

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
    const id = projectId?.trim()
    if (!id) {
        return { isPending: ref<boolean>(false), data: ref<ProjectView>() }
    }
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

export const useProjectCreate = (project: CreateProjectRequest, alertError: boolean = true) => {
    return useBaseMutation<CreateProjectRequest, ProjectView>(
        async () => {
            const { data, error } = await ProjectApiFactory().v1ProjectPost(project)
            if (error) throw error
            return data!
        },
        {
            alertError,
        }
    )
}

export const useProjectUpdate = (id: string, body: UpdateProjectRequest, alertError: boolean = true) => {
    return useBaseMutation<UpdateProjectRequest, ProjectView>(
        async () => {
            const { data, error } = await ProjectApiFactory().v1ProjectIdPut(body, id)
            if (error) throw error
            return data!
        },
        {
            alertError,
        }
    )
}

export const useProjectPlatform = (id: string, body: Array<UpdateProjectPlatformRequest>, alertError: boolean = true) => {
    return useBaseMutation<Array<UpdateProjectPlatformRequest>, ProjectView>(
        async () => {
            const { data, error } = await ProjectApiFactory().v1ProjectIdPlatformPut(body, id)
            if (error) throw error
            return data!
        },
        {
            alertError,
        }
    )
}

export const useProjectDesign = (id: string, body: Array<UpdateProjectDesignRequest>, alertError: boolean = true) => {
    return useBaseMutation<Array<UpdateProjectDesignRequest>, ProjectView>(
        async () => {
            const { data, error } = await ProjectApiFactory().v1ProjectIdDesignPut(body, id)
            if (error) throw error
            return data!
        },
        {
            alertError,
        }
    )
}
