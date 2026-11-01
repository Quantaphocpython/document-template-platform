import { BaseCatalogService } from 'core';
import { INITIAL_SLIDE_TEMPLATES, SLIDE_CATEGORIES } from '@/data/templates';
import { SlideCategory, SlideTemplate } from '@/types';
import { pptxGeneratorService } from './pptx-generator.service';

class TemplateService extends BaseCatalogService<SlideTemplate, SlideCategory> {
  constructor() {
    const normalizedTemplates = INITIAL_SLIDE_TEMPLATES.map((tpl) => ({
      ...tpl,
      title: tpl.title.normalize('NFC'),
      description: tpl.description.normalize('NFC'),
      tags: tpl.tags.map((t) => t.normalize('NFC')),
      slides: tpl.slides.map((s) => ({
        ...s,
        title: s.title.normalize('NFC'),
        description: s.description.normalize('NFC'),
      })),
    }));
    const normalizedCategories = SLIDE_CATEGORIES.map((cat) => ({
      ...cat,
      name: cat.name.normalize('NFC'),
      description: cat.description.normalize('NFC'),
    }));
    super(normalizedTemplates, normalizedCategories);

    // Ensure template files exist on server startup
    pptxGeneratorService.ensureTemplateFilesExist().catch((err) => {
      console.error('Lỗi khởi tạo file mẫu PPTX:', err);
    });
  }
}

export const templateService = new TemplateService();
