import { BaseCatalogService } from 'core';
import { CATEGORIES, INITIAL_TEMPLATES } from '@/data/templates';
import { Template, TemplateCategory } from '@/types';

class TemplateService extends BaseCatalogService<Template, TemplateCategory> {
  constructor() {
    const normalizedTemplates = INITIAL_TEMPLATES.map((tpl) => ({
      ...tpl,
      title: tpl.title.normalize('NFC'),
      description: tpl.description.normalize('NFC'),
      contentHtml: tpl.contentHtml.normalize('NFC'),
      tags: tpl.tags.map((t) => t.normalize('NFC')),
    }));
    const normalizedCategories = CATEGORIES.map((cat) => ({
      ...cat,
      name: cat.name.normalize('NFC'),
      description: cat.description.normalize('NFC'),
    }));
    super(normalizedTemplates, normalizedCategories);
  }
}

export const templateService = new TemplateService();
