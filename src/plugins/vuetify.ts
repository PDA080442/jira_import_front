import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const forestTrust = {
  dark: false,
  colors: {
    background: '#FAFAF9',
    surface: '#FFFFFF',
    primary: '#16A34A',
    secondary: '#334155',
    accent: '#0EA5E9',
    error: '#B91C1C',
    success: '#15803D',
    info: '#0EA5E9',
    warning: '#CA8A04',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-background': '#1C1917',
    'on-surface': '#1C1917',
    muted: '#78716C',
    'primary-light': '#4ADE80',
    sidebar: '#F5F5F4',
  },
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'forestTrust',
    themes: {
      forestTrust,
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      elevation: 0,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
      color: 'primary',
    },
    VCheckbox: {
      color: 'primary',
      density: 'comfortable',
    },
  },
})

export default vuetify
