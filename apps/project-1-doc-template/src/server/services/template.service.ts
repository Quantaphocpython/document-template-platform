import { BaseCatalogService } from '@preview/core';
import { CATEGORIES, INITIAL_TEMPLATES } from '@/data/templates';
import { Template, TemplateCategory } from '@/types';

class TemplateService extends BaseCatalogService<Template, TemplateCategory> {
  constructor() {
    super(INITIAL_TEMPLATES, CATEGORIES);
  }
}

export const templateService = new TemplateService();
