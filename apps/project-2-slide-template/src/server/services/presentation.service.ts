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

    const presentationId = `pres-${template.id}-${crypto.randomUUID()}`;
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

  /**
   * Synthesize / restore a presentation instance from template on serverless cold starts.
   */
  public async synthesizePresentationFromTemplate(id: string): Promise<UserPresentation> {
    await pptxGeneratorService.ensureTemplateFilesExist();

    let templateId: string | undefined;
    const allTemplates = templateService.getAll();
    for (const t of allTemplates) {
      if (id.startsWith(`pres-${t.id}-`) || id.includes(t.id) || id.includes(t.id.replace('tpl-', ''))) {
        templateId = t.id;
        break;
      }
    }

    if (!templateId) {
      templateId = 'tpl-pitch-deck-investor';
    }

    const template = templateService.getTemplateById(templateId) || templateService.getAll()[0];
    const targetFileName = `${id}.pptx`;
    const presentationsDir = storageService.getPresentationsDir();
    const targetFilePath = path.join(presentationsDir, targetFileName);
    const sourceFilePath = path.join(storageService.getTemplatesDir(), template.pptxFileName);

    if (fs.existsSync(sourceFilePath)) {
      fs.copyFileSync(sourceFilePath, targetFilePath);
    }

    let fileSize = 0;
    if (fs.existsSync(targetFilePath)) {
      fileSize = fs.statSync(targetFilePath).size;
    }

    const now = new Date().toISOString();
    const presentation: UserPresentation = {
      id,
      title: `${template.title} (Bản sao)`,
      clonedFromTemplateId: template.id,
      clonedFromTemplateTitle: template.title,
      totalSlides: template.totalSlides,
      pptxFileName: targetFileName,
      fileSizeBytes: fileSize,
      createdAt: now,
      updatedAt: now,
    };

    try {
      storageService.savePresentationMeta(presentation);
    } catch (e) {
      console.warn('Could not cache presentation meta:', e);
    }

    return presentation;
  }

  public async getPresentationById(id: string): Promise<UserPresentation | null> {
    let meta = storageService.getPresentationMeta(id);
    if (!meta) {
      meta = await this.synthesizePresentationFromTemplate(id);
    }
    return meta;
  }

  public async getPresentationFilePath(id: string): Promise<{ filePath: string; presentation: UserPresentation } | null> {
    let meta = storageService.getPresentationMeta(id);
    if (!meta) {
      meta = await this.synthesizePresentationFromTemplate(id);
    }
    if (!meta) return null;

    const presentationsDir = storageService.getPresentationsDir();
    const filePath = path.join(presentationsDir, meta.pptxFileName);

    if (!fs.existsSync(filePath)) {
      await this.synthesizePresentationFromTemplate(id);
    }

    if (!fs.existsSync(filePath)) return null;

    return { filePath, presentation: meta };
  }

  public listPresentations(): UserPresentation[] {
    return storageService.listPresentations();
  }
}

export const presentationService = new PresentationService();

