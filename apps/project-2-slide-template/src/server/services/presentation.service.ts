import fs from 'fs';
import path from 'path';
import { UserPresentation } from '@/types';
import { storageService } from './storage.service';
import { templateService } from './template.service';
import { pptxGeneratorService } from './pptx-generator.service';

export interface CreatePresentationInput {
  templateId: string;
  customTitle?: string;
}

class PresentationService {
  /**
   * Clone a PPTX template into a new independent presentation (Copy-on-Create).
   * Key Requirement: Preserves 100% of the original master PPTX file!
   */
  public async createFromTemplate(input: CreatePresentationInput): Promise<UserPresentation> {
    const template = templateService.getTemplateById(input.templateId);
    if (!template) {
      throw new Error(`Template với mã "${input.templateId}" không tồn tại.`);
    }

    // Ensure master template file exists
    await pptxGeneratorService.ensureTemplateFilesExist();

    const templatesDir = storageService.getTemplatesDir();
    const sourceFilePath = path.join(templatesDir, template.pptxFileName);

    if (!fs.existsSync(sourceFilePath)) {
      throw new Error(`File mẫu gốc "${template.pptxFileName}" không tìm thấy.`);
    }

    const presentationId = `pres-${crypto.randomUUID()}`;
    const targetFileName = `${presentationId}.pptx`;
    const presentationsDir = storageService.getPresentationsDir();
    const targetFilePath = path.join(presentationsDir, targetFileName);

    // Physical File Copy to ensure independent existence (Copy-on-Create)
    fs.copyFileSync(sourceFilePath, targetFilePath);

    const stats = fs.statSync(targetFilePath);
    const now = new Date().toISOString();

    const presentation: UserPresentation = {
      id: presentationId,
      title: input.customTitle?.trim() || `${template.title} (Bản sao)`,
      clonedFromTemplateId: template.id,
      clonedFromTemplateTitle: template.title,
      totalSlides: template.totalSlides,
      pptxFileName: targetFileName,
      fileSizeBytes: stats.size,
      createdAt: now,
      updatedAt: now,
    };

    // Save metadata
    storageService.savePresentationMeta(presentation);

    return presentation;
  }

  public getPresentationById(id: string): UserPresentation | null {
    return storageService.getPresentationMeta(id);
  }

  public getPresentationFilePath(id: string): { filePath: string; presentation: UserPresentation } | null {
    const meta = storageService.getPresentationMeta(id);
    if (!meta) return null;

    const filePath = path.join(storageService.getPresentationsDir(), meta.pptxFileName);
    if (!fs.existsSync(filePath)) return null;

    return { filePath, presentation: meta };
  }

  public listPresentations(): UserPresentation[] {
    return storageService.listPresentations();
  }
}

export const presentationService = new PresentationService();

