export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryMeta<TId extends string = string> {
  id: TId;
  name: string;
  description: string;
}

export interface BaseTemplateItem<TCategory extends string = string> extends BaseEntity {
  title: string;
  description: string;
  category: TCategory;
  categoryName: string;
  thumbnailUrl: string;
  tags: string[];
  author?: string;
}

export interface BaseUserInstance<TCategory extends string = string> extends BaseEntity {
  title: string;
  clonedFromTemplateId: string;
  clonedFromTemplateTitle: string;
  category?: TCategory;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ICatalogListResponse<TItem, TCategory extends string = string> {
  templates: TItem[];
  categories: CategoryMeta<TCategory>[];
  total: number;
}

