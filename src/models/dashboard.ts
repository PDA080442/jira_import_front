export type DashboardStatTone = 'total' | 'success' | 'error' | 'progress'
export type DashboardStatusTone = 'success' | 'error' | 'progress'

export interface DashboardStat {
  label: string
  value: string
  tone: DashboardStatTone
  icon: string
}

export interface DashboardImport {
  name: string
  status: string
  statusTone: DashboardStatusTone
  date: string
}

export interface DashboardErrorItem {
  file: string
  message: string
  date: string
}

export interface DashboardChartBar {
  label: string
  value: number
}

export interface DashboardData {
  welcomeSubtitle: string
  stats: DashboardStat[]
  recentImports: DashboardImport[]
  recentErrors: DashboardErrorItem[]
  weeklyChart: DashboardChartBar[]
  chartMax: number
}

export const buildEmptyDashboardData = (workspaceName?: string): DashboardData => ({
  welcomeSubtitle: workspaceName ? `${workspaceName} · 0 импортов за месяц` : '0 импортов за месяц',
  stats: [
    { label: 'Всего', value: '0', tone: 'total', icon: 'mdi-database-outline' },
    { label: 'Успешных', value: '0', tone: 'success', icon: 'mdi-check-circle-outline' },
    { label: 'Ошибок', value: '0', tone: 'error', icon: 'mdi-alert-outline' },
    { label: 'В процессе', value: '0', tone: 'progress', icon: 'mdi-clock-outline' },
  ],
  recentImports: [],
  recentErrors: [],
  weeklyChart: [
    { label: '15 апр', value: 0 },
    { label: '22 апр', value: 0 },
    { label: '29 апр', value: 0 },
    { label: '6 мая', value: 0 },
    { label: '13 мая', value: 0 },
    { label: '20 мая', value: 0 },
  ],
  chartMax: 15,
})
