export enum TemplateCategory {
  ALL = 'all',
  CONTRACT = 'contract',
  HR = 'hr',
  MEETING = 'meeting',
  REPORT = 'report',
  PROPOSAL = 'proposal',
}

export interface CategoryInfo {
  id: TemplateCategory;
  name: string;
  description: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: Exclude<TemplateCategory, TemplateCategory.ALL>;
  categoryName: string;
  thumbnailUrl: string;
  version: string;
  tags: string[];
  contentHtml: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export enum DocumentStatus {
  DRAFT = 'draft',
  SAVED = 'saved',
  EXPORTED = 'exported',
}

export interface UserDocument {
  id: string;
  title: string;
  clonedFromTemplateId: string;
  clonedFromTemplateTitle: string;
  category: Exclude<TemplateCategory, TemplateCategory.ALL>;
  contentHtml: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TemplateListResponse {
  templates: Template[];
  categories: CategoryInfo[];
  total: number;
}
