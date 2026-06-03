import type { ApiUuid, IsoDateTimeString, MessageResponse } from './common'

/** Roles returned by the API for workspace members. */
export type WorkspaceMemberRole = 'owner' | 'admin' | 'editor' | 'viewer'

/** Roles allowed when inviting a user (cannot invite as owner). */
export type WorkspaceInviteRole = 'admin' | 'editor' | 'viewer'

/** Workspace entity from list/detail/create/update endpoints. */
export interface Workspace {
  id: ApiUuid
  name: string
  slug: string
  owner_id: ApiUuid
  created_at: IsoDateTimeString
  updated_at: IsoDateTimeString
}

/** `GET /api/workspaces/` */
export type WorkspaceListResponse = Workspace[]

/** `POST /api/workspaces/` */
export interface CreateWorkspaceRequest {
  name: string
}

/** `PATCH /api/workspaces/{id}/` */
export interface UpdateWorkspaceRequest {
  name: string
}

/** Member item inside `GET /api/workspaces/{id}/members/`. */
export interface WorkspaceMember {
  id: ApiUuid
  user_id: ApiUuid
  email: string
  role: WorkspaceMemberRole
  joined_at: IsoDateTimeString
}

/** `GET /api/workspaces/{id}/members/` */
export interface WorkspaceMembersResponse {
  members: WorkspaceMember[]
}

/** `POST /api/workspaces/{id}/invites/` */
export interface CreateWorkspaceInviteRequest {
  email: string
  role: WorkspaceInviteRole
}

/** Created invite (token is sent by email, not returned). */
export interface WorkspaceInvite {
  id: ApiUuid
  email: string
  role: WorkspaceInviteRole
  expires_at: IsoDateTimeString
}

/** `POST /api/workspaces/invites/accept/` */
export interface AcceptWorkspaceInviteRequest {
  token: string
}

export interface AcceptWorkspaceInviteResponse extends MessageResponse {
  workspace_id: ApiUuid
  role: WorkspaceMemberRole
}

/** Path parameter for workspace-scoped routes. */
export interface WorkspaceIdParams {
  id: ApiUuid
}
