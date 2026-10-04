export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/perfil',
  NOTIFICATIONS: '/notificaciones',
  USERS: '/usuarios',
  AUDIT: '/auditoria',
  SIMILARITY: {
    ROOT: '/similitud',
    ANALYZE: '/similitud/analizar',
    REPORTS: '/similitud/reportes',
  },
  LSM: {
    ROOT: '/lsm',
    PRACTICE: '/lsm/practica',
    GLOSSARY: '/lsm/glosario',
  },
  SCHOLARSHIPS: {
    ROOT: '/becas',
    RECOMMENDATIONS: '/becas/recomendaciones',
    PROFILE: '/becas/perfil',
  },
} as const;
