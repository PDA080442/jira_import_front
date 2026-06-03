import type {
  AcceptWorkspaceInviteRequest,
  AcceptWorkspaceInviteResponse,
  ApiUuid,
  CreateWorkspaceInviteRequest,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  Workspace,
  WorkspaceInvite,
  WorkspaceListResponse,
  WorkspaceMembersResponse,
} from '@/types'

import { useApi } from './useApi'

export function useWorkspaceApi() {
  const api = useApi('/api/workspaces')

  return {
    /** `GET /api/workspaces/` */
    list: (headers?: { 'X-Trace-Id'?: string }) => api.get<WorkspaceListResponse>('/', { headers }),

    /** `POST /api/workspaces/` */
    create: (body: CreateWorkspaceRequest, headers?: { 'X-Trace-Id'?: string }) =>
      api.post<Workspace>('/', body, { headers }),

    /** `GET /api/workspaces/{id}/` */
    getById: (id: ApiUuid, headers?: { 'X-Trace-Id'?: string }) =>
      api.get<Workspace>(`/${id}/`, { headers }),

    /** `PATCH /api/workspaces/{id}/` */
    update: (id: ApiUuid, body: UpdateWorkspaceRequest, headers?: { 'X-Trace-Id'?: string }) =>
      api.patch<Workspace>(`/${id}/`, body, { headers }),

    /** `DELETE /api/workspaces/{id}/` — `204 No Content` */
    delete: (id: ApiUuid, headers?: { 'X-Trace-Id'?: string }) =>
      api.delete<void>(`/${id}/`, { headers }),

    /** `GET /api/workspaces/{id}/members/` */
    listMembers: (id: ApiUuid, headers?: { 'X-Trace-Id'?: string }) =>
      api.get<WorkspaceMembersResponse>(`/${id}/members/`, { headers }),

    /** `POST /api/workspaces/{id}/invites/` */
    createInvite: (
      id: ApiUuid,
      body: CreateWorkspaceInviteRequest,
      headers?: { 'X-Trace-Id'?: string },
    ) => api.post<WorkspaceInvite>(`/${id}/invites/`, body, { headers }),

    /** `POST /api/workspaces/invites/accept/` */
    acceptInvite: (body: AcceptWorkspaceInviteRequest, headers?: { 'X-Trace-Id'?: string }) =>
      api.post<AcceptWorkspaceInviteResponse>('/invites/accept/', body, { headers }),
  }
}
