export const APP_ROUTES = {
  HOME: '/',
  DOCUMENTS: {
    DETAIL: (id: string) => `/documents/${id}`,
    EDITOR: (id: string) => `/documents/${id}`,
    GALLERY: '/',
  },
  PRESENTATIONS: {
    GALLERY: '/',
  },
} as const;

export const API_ROUTES = {
  TEMPLATES: {
    LIST: '/api/templates',
    DETAIL: (id: string) => `/api/templates/${id}`,
  },
  DOCUMENTS: {
    LIST: '/api/documents',
    CREATE: '/api/documents',
    DETAIL: (id: string) => `/api/documents/${id}`,
    EXPORT_DOCX: (id: string) => `/api/documents/${id}/export`,
  },
  PRESENTATIONS: {
    LIST: '/api/presentations',
    CREATE: '/api/presentations',
    DETAIL: (id: string) => `/api/presentations/${id}`,
    DOWNLOAD_PPTX: (id: string) => `/api/presentations/${id}/download`,
  },
} as const;

