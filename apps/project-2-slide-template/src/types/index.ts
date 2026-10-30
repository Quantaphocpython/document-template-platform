export enum SlideCategory {
  ALL = 'all',
  PITCH_DECK = 'pitch-deck',
  QUARTERLY_REVIEW = 'quarterly-review',
  PRODUCT_LAUNCH = 'product-launch',
}

export interface CategoryInfo {
  id: SlideCategory;
  name: string;
  description: string;
}

export enum SlideLayoutType {
  COVER = 'cover',
  AGENDA = 'agenda',
  CONTENT = 'content',
  KPI = 'kpi',
  TEAM = 'team',
}

export enum AspectRatio {
  RATIO_16_9 = '16:9',
}

export interface SlideItem {
  id: string;
  slideNumber: number;
  title: string;
  description: string;
  previewImageUrl: string;
  layoutType: SlideLayoutType;
}

export interface SlideTemplate {
  id: string;
  title: string;
  description: string;
  category: Exclude<SlideCategory, SlideCategory.ALL>;
  categoryName: string;
  thumbnailUrl: string;
  totalSlides: number;
  aspectRatio: AspectRatio.RATIO_16_9 | '16:9';
  tags: string[];
  slides: SlideItem[];
  pptxFileName: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPresentation {
  id: string;
  title: string;
  clonedFromTemplateId: string;
  clonedFromTemplateTitle: string;
  totalSlides: number;
  pptxFileName: string;
  fileSizeBytes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SlideTemplateListResponse {
  templates: SlideTemplate[];
  categories: CategoryInfo[];
  total: number;
}
