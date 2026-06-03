import type {
  Workspace as ApiWorkspace,
  WorkspaceMember as ApiWorkspaceMember,
  WorkspaceMemberRole,
  WorkspaceInviteRole,
} from '@/types'

export type WorkspaceRole = 'Owner' | 'Admin' | 'Editor' | 'Viewer'

export type WorkspaceIcon = 'tree' | 'leaf' | 'mountain'

export interface WorkspaceListItem {
  id: string
  name: string
  slug: string
  description?: string
  icon: WorkspaceIcon
  role: WorkspaceRole
  membersCount: number
  lastActivityLabel: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface WorkspaceMemberView {
  id: string
  name: string
  email: string
  avatar?: string
  role: WorkspaceRole
  addedAt: string
}

export interface AcceptInviteView {
  token: string
  workspaceName: string
  inviterName: string
  role: WorkspaceRole
  expiresInDays: number
}

const ICONS: WorkspaceIcon[] = ['tree', 'leaf', 'mountain']

export const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const apiRoleToUi = (role: WorkspaceMemberRole | WorkspaceInviteRole): WorkspaceRole => {
  const map: Record<string, WorkspaceRole> = {
    owner: 'Owner',
    admin: 'Admin',
    editor: 'Editor',
    viewer: 'Viewer',
  }

  return map[role] ?? 'Viewer'
}

export const uiRoleToInviteApi = (role: WorkspaceRole): WorkspaceInviteRole => {
  const map: Record<WorkspaceRole, WorkspaceInviteRole> = {
    Owner: 'admin',
    Admin: 'admin',
    Editor: 'editor',
    Viewer: 'viewer',
  }

  return map[role]
}

const pickIcon = (seed: string): WorkspaceIcon => {
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return ICONS[hash % ICONS.length] ?? 'tree'
}

const formatRelativeDate = (isoDate: string): string => {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const displayNameFromEmail = (email: string): string => {
  const local = email.split('@')[0] ?? email
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const mapApiWorkspaceToListItem = (
  workspace: ApiWorkspace,
  options: {
    currentUserId?: string | null
    membersCount?: number
    role?: WorkspaceMemberRole
  } = {},
): WorkspaceListItem => {
  const role =
    options.role ??
    (options.currentUserId && workspace.owner_id === options.currentUserId ? 'owner' : 'editor')

  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    icon: pickIcon(workspace.slug),
    role: apiRoleToUi(role),
    membersCount: options.membersCount ?? 0,
    lastActivityLabel: formatRelativeDate(workspace.updated_at),
    owner_id: workspace.owner_id,
    created_at: workspace.created_at,
    updated_at: workspace.updated_at,
  }
}

export const mapApiMemberToView = (member: ApiWorkspaceMember): WorkspaceMemberView => ({
  id: member.id,
  name: displayNameFromEmail(member.email),
  email: member.email,
  role: apiRoleToUi(member.role),
  addedAt: new Date(member.joined_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
})
