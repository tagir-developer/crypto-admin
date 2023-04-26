import {
  ICreateProjectDto,
  IProject,
  IUpdateProjectDto,
} from 'pages/Projects/Projects.interfaces';

import { api } from './api';

export const PROJECTS_API_URL = '/projects';

export const projectsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<IProject[], string>({
      query: (params) => {
        return { url: PROJECTS_API_URL };
      },
      providesTags: ['Projects'],
    }),

    createProject: builder.mutation<{ message: string }, ICreateProjectDto>({
      query: (data) => ({
        url: PROJECTS_API_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Projects'],
    }),

    updateProject: builder.mutation<{ message: string }, IUpdateProjectDto>({
      query: (data) => ({
        url: `${PROJECTS_API_URL}/${data.id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Projects'],
    }),

    deleteProject: builder.mutation<{ message: string }, string>({
      query: (projectId) => ({
        url: `${PROJECTS_API_URL}/${projectId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),
  }),
});
