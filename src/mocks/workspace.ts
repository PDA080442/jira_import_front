const MOCK_DELAY_MS = 800
const MOCK_LOADING_DELAY_MS = 3000

export const MOCK_INVITE_TOKEN = 'demo-invite-token'

export type WorkspaceRole = 'Owner' | 'Admin' | 'Editor' | 'Viewer'

export type WorkspaceIcon = 'tree' | 'leaf' | 'mountain'

export interface Workspace {
  id: string
  name: string
  slug: string
  description?: string
  icon: WorkspaceIcon
  role: WorkspaceRole
  membersCount: number
  lastActivityLabel: string
}

export interface WorkspaceMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: WorkspaceRole
  addedAt: string
}

export interface WorkspaceInvite {
  token: string
  workspaceName: string
  inviterName: string
  role: WorkspaceRole
  expiresInDays: number
}

export interface CreateWorkspacePayload {
  name: string
  slug: string
  description?: string
}

export interface UpdateWorkspacePayload extends CreateWorkspacePayload {
  id: string
}

export interface InviteMemberPayload {
  workspaceId: string
  email: string
  role: WorkspaceRole
  message?: string
}

export type MockResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; fieldErrors?: Record<string, string> }

const MOCK_WORKSPACES: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Forest Trust',
    slug: 'forest-trust',
    icon: 'tree',
    role: 'Owner',
    membersCount: 8,
    lastActivityLabel: 'Сегодня, 10:24',
  },
  {
    id: 'ws-2',
    name: 'Conservation Team',
    slug: 'conservation-team',
    icon: 'leaf',
    role: 'Editor',
    membersCount: 5,
    lastActivityLabel: 'Вчера, 15:47',
  },
  {
    id: 'ws-3',
    name: 'Reforestation Project',
    slug: 'reforestation-project',
    icon: 'mountain',
    role: 'Editor',
    membersCount: 3,
    lastActivityLabel: '12 мая 2024, 09:15',
  },
]

const MOCK_MEMBERS: Record<string, WorkspaceMember[]> = {
  'ws-1': [
    {
      id: 'm-1',
      name: 'Иван Петров',
      email: 'ivan.petrov@example.com',
      role: 'Owner',
      addedAt: '12.04.2024 10:30',
    },
    {
      id: 'm-2',
      name: 'Мария Смирнова',
      email: 'maria.smirnova@example.com',
      role: 'Admin',
      addedAt: '15.04.2024 14:20',
    },
    {
      id: 'm-3',
      name: 'Алексей Кузнецов',
      email: 'alexey.kuznetsov@example.com',
      role: 'Editor',
      addedAt: '20.04.2024 09:15',
    },
    {
      id: 'm-4',
      name: 'Екатерина Волкова',
      email: 'ekaterina.volkova@example.com',
      role: 'Viewer',
      addedAt: '22.04.2024 16:45',
    },
    {
      id: 'm-5',
      name: 'Дмитрий Соколов',
      email: 'dmitry.sokolov@example.com',
      role: 'Editor',
      addedAt: '01.05.2024 11:00',
    },
  ],
}

const MOCK_INVITE: WorkspaceInvite = {
  token: MOCK_INVITE_TOKEN,
  workspaceName: 'Acme Team',
  inviterName: 'Анна Белова',
  role: 'Editor',
  expiresInDays: 7,
}

const delay = (ms = MOCK_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

const resolveDelay = (forceLoading?: boolean) =>
  delay(forceLoading ? MOCK_LOADING_DELAY_MS : MOCK_DELAY_MS)

export const fetchWorkspaces = async (forceLoading = false): Promise<MockResult<Workspace[]>> => {
  await resolveDelay(forceLoading)
  return { ok: true, data: [...MOCK_WORKSPACES] }
}

const validateWorkspacePayload = (
  payload: CreateWorkspacePayload,
  excludeWorkspaceId?: string,
): { fieldErrors?: Record<string, string>; message?: string } | null => {
  const fieldErrors: Record<string, string> = {}

  if (!payload.name?.trim()) {
    fieldErrors.name = 'Введите название workspace'
  }

  if (!payload.slug?.trim()) {
    fieldErrors.slug = 'Введите URL slug'
  } else if (!/^[a-z0-9-]+$/.test(payload.slug)) {
    fieldErrors.slug = 'Используйте только латинские буквы, цифры и дефисы'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { message: 'Проверьте заполнение формы', fieldErrors }
  }

  const exists = MOCK_WORKSPACES.some(
    (ws) => ws.slug === payload.slug.trim() && ws.id !== excludeWorkspaceId,
  )

  if (exists) {
    return {
      message: 'Workspace с таким URL уже существует',
      fieldErrors: { slug: 'URL уже занят' },
    }
  }

  return null
}

export const createWorkspace = async (
  payload: CreateWorkspacePayload,
): Promise<MockResult<Workspace>> => {
  await delay()

  const validationError = validateWorkspacePayload(payload)

  if (validationError) {
    return {
      ok: false,
      message: validationError.message ?? 'Ошибка валидации',
      fieldErrors: validationError.fieldErrors,
    }
  }

  const workspace: Workspace = {
    id: `ws-${Date.now()}`,
    name: payload.name.trim(),
    slug: payload.slug.trim(),
    description: payload.description?.trim(),
    icon: 'tree',
    role: 'Owner',
    membersCount: 1,
    lastActivityLabel: 'Только что',
  }

  MOCK_WORKSPACES.unshift(workspace)
  MOCK_MEMBERS[workspace.id] = [
    {
      id: `m-${Date.now()}`,
      name: 'Иван Петров',
      email: 'ivan.petrov@example.com',
      role: 'Owner',
      addedAt: new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]

  return { ok: true, data: workspace }
}

export const updateWorkspace = async (
  payload: UpdateWorkspacePayload,
): Promise<MockResult<Workspace>> => {
  await delay()

  const validationError = validateWorkspacePayload(payload, payload.id)

  if (validationError) {
    return {
      ok: false,
      message: validationError.message ?? 'Ошибка валидации',
      fieldErrors: validationError.fieldErrors,
    }
  }

  const index = MOCK_WORKSPACES.findIndex((ws) => ws.id === payload.id)

  if (index === -1) {
    return { ok: false, message: 'Workspace не найден' }
  }

  const current = MOCK_WORKSPACES[index]!

  const workspace: Workspace = {
    ...current,
    name: payload.name.trim(),
    slug: payload.slug.trim(),
    description: payload.description?.trim(),
  }

  MOCK_WORKSPACES[index] = workspace

  return { ok: true, data: { ...workspace } }
}

export const deleteWorkspace = async (
  workspaceId: string,
): Promise<MockResult<{ message: string }>> => {
  await delay()

  const index = MOCK_WORKSPACES.findIndex((ws) => ws.id === workspaceId)

  if (index === -1) {
    return { ok: false, message: 'Workspace не найден' }
  }

  MOCK_WORKSPACES.splice(index, 1)
  delete MOCK_MEMBERS[workspaceId]

  return { ok: true, data: { message: 'Workspace удалён' } }
}

export const duplicateWorkspace = async (workspaceId: string): Promise<MockResult<Workspace>> => {
  await delay()

  const source = MOCK_WORKSPACES.find((ws) => ws.id === workspaceId)

  if (!source) {
    return { ok: false, message: 'Workspace не найден' }
  }

  let copySlug = `${source.slug}-copy`
  let counter = 2

  while (MOCK_WORKSPACES.some((ws) => ws.slug === copySlug)) {
    copySlug = `${source.slug}-copy-${counter}`
    counter += 1
  }

  const workspace: Workspace = {
    id: `ws-${Date.now()}`,
    name: `${source.name} (копия)`,
    slug: copySlug,
    description: source.description,
    icon: source.icon,
    role: 'Owner',
    membersCount: source.membersCount,
    lastActivityLabel: 'Только что',
  }

  MOCK_WORKSPACES.unshift(workspace)
  MOCK_MEMBERS[workspace.id] = (MOCK_MEMBERS[workspaceId] ?? []).map((member) => ({
    ...member,
    id: `m-${Date.now()}-${member.id}`,
  }))

  return { ok: true, data: workspace }
}

export const fetchMembers = async (
  workspaceId: string,
  options?: { forceLoading?: boolean; forceEmpty?: boolean },
): Promise<MockResult<WorkspaceMember[]>> => {
  await resolveDelay(options?.forceLoading)

  if (options?.forceEmpty) {
    return { ok: true, data: [] }
  }

  const members = MOCK_MEMBERS[workspaceId] ?? MOCK_MEMBERS['ws-1'] ?? []

  return { ok: true, data: [...members] }
}

export const inviteMember = async (
  payload: InviteMemberPayload,
): Promise<MockResult<{ message: string }>> => {
  await delay()

  if (!payload.email?.trim()) {
    return {
      ok: false,
      message: 'Введите email участника',
      fieldErrors: { email: 'Введите email' },
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(payload.email.trim())) {
    return {
      ok: false,
      message: 'Некорректный email',
      fieldErrors: { email: 'Некорректный email' },
    }
  }

  return { ok: true, data: { message: 'Приглашение отправлено' } }
}

export const fetchInvite = async (token: string): Promise<MockResult<WorkspaceInvite>> => {
  await delay()

  if (!token?.trim() || token !== MOCK_INVITE_TOKEN) {
    return { ok: false, message: 'Приглашение недействительно или истекло' }
  }

  return { ok: true, data: { ...MOCK_INVITE } }
}

export const acceptInvite = async (token: string): Promise<MockResult<{ message: string }>> => {
  await delay()

  const inviteResult = await fetchInvite(token)

  if (!inviteResult.ok) {
    return { ok: false, message: inviteResult.message }
  }

  return { ok: true, data: { message: 'Вы успешно присоединились к workspace' } }
}

export const declineInvite = async (token: string): Promise<MockResult<{ message: string }>> => {
  await delay()

  const inviteResult = await fetchInvite(token)

  if (!inviteResult.ok) {
    return { ok: false, message: inviteResult.message }
  }

  return { ok: true, data: { message: 'Приглашение отклонено' } }
}

export const updateMemberRole = async (
  workspaceId: string,
  memberId: string,
  role: WorkspaceRole,
): Promise<MockResult<WorkspaceMember>> => {
  await delay()

  const members = MOCK_MEMBERS[workspaceId]

  if (!members) {
    return { ok: false, message: 'Workspace не найден' }
  }

  const member = members.find((item) => item.id === memberId)

  if (!member) {
    return { ok: false, message: 'Участник не найден' }
  }

  member.role = role

  return { ok: true, data: { ...member } }
}

export const removeMember = async (
  workspaceId: string,
  memberId: string,
): Promise<MockResult<{ message: string }>> => {
  await delay()

  const members = MOCK_MEMBERS[workspaceId]

  if (!members) {
    return { ok: false, message: 'Workspace не найден' }
  }

  const index = members.findIndex((item) => item.id === memberId)

  if (index === -1) {
    return { ok: false, message: 'Участник не найден' }
  }

  if (members[index]?.role === 'Owner') {
    return { ok: false, message: 'Нельзя удалить владельца workspace' }
  }

  members.splice(index, 1)

  const workspace = MOCK_WORKSPACES.find((ws) => ws.id === workspaceId)

  if (workspace) {
    workspace.membersCount = members.length
  }

  return { ok: true, data: { message: 'Участник удалён' } }
}

export const slugify = (name: string): string =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
