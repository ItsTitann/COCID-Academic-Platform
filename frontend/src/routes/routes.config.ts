export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/usuarios',
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
