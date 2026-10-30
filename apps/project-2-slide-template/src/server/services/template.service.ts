import { BaseCatalogService } from '@preview/core';
import { INITIAL_SLIDE_TEMPLATES, SLIDE_CATEGORIES } from '@/data/templates';
import { SlideCategory, SlideTemplate } from '@/types';
import { pptxGeneratorService } from './pptx-generator.service';

class TemplateService extends BaseCatalogService<SlideTemplate, SlideCategory> {
  constructor() {
    super(INITIAL_SLIDE_TEMPLATES, SLIDE_CATEGORIES);

    // Ensure template files exist on server startup
    pptxGeneratorService.ensureTemplateFilesExist().catch((err) => {
      console.error('Lỗi khởi tạo file mẫu PPTX:', err);
    });
  }
}

export const templateService = new TemplateService();
