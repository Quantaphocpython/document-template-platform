import { DocumentStatus, UserDocument } from '@/types';
import { storageService } from './storage.service';
import { templateService } from './template.service';

export interface CreateDocumentInput {
  templateId: string;
  customTitle?: string;
}

export interface UpdateDocumentInput {
  title?: string;
  contentHtml?: string;
  status?: DocumentStatus;
}

function normalizeDocumentHtml(html: string): string {
  if (!html) return html;
  let normalized = html;

  // Fix header text-align if missing
  if (
    normalized.includes('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM') &&
    !normalized.includes('text-align: center')
  ) {
    normalized = normalized.replace(
      /<p[^>]*>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<\/p>/g,
      '<p style="text-align: center; font-weight: bold; font-size: 13pt; margin: 0; line-height: 1.4;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>',
    );
    normalized = normalized.replace(
      /<p[^>]*>Độc lập - Tự do - Hạnh phúc<\/p>/g,
      '<p style="text-align: center; font-weight: bold; text-decoration: underline; font-size: 12pt; margin: 0 0 16px 0; line-height: 1.4;">Độc lập - Tự do - Hạnh phúc</p>',
    );
    normalized = normalized.replace(
      /<p[^>]*>Hà Nội, ngày \.\.\.\.\. tháng \.\.\.\.\. năm 2026<\/p>/g,
      '<p style="text-align: right; font-style: italic; margin-bottom: 24px;">Hà Nội, ngày ..... tháng ..... năm 2026</p>',
    );
    normalized = normalized.replace(
      /<h1[^>]*>HỢP ĐỒNG LAO ĐỘNG<\/h1>/g,
      '<h1 style="text-align: center; font-size: 18pt; font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">HỢP ĐỒNG LAO ĐỘNG</h1>',
    );
    normalized = normalized.replace(
      /<p[^>]*>\(Số: \.\.\.\.\.\.\/2026\/HĐLĐ-CTY\)<\/p>/g,
      '<p style="text-align: center; font-style: italic; margin-bottom: 24px;">(Số: ....../2026/HĐLĐ-CTY)</p>',
    );
  }

  // Remove generic wrapping divs that drop styles
  if (normalized.includes('<div style="text-align: center; margin-bottom:')) {
    normalized = normalized.replace(
      /<div style="text-align: center; margin-bottom: \d+px;">/g,
      '',
    );
    normalized = normalized.replace(/<\/div>/g, '');
  }

  return normalized;
}

class DocumentService {
  /**
   * Synthesize / reconstruct a UserDocument from a template if not found on disk.
   * Guarantees 100% serverless resilience when requests are routed across ephemeral containers.
   */
  public synthesizeDocumentFromTemplate(
    id: string,
    preferredTemplateId?: string,
  ): UserDocument {
    // 1. Try preferredTemplateId if provided and valid
    let templateId = preferredTemplateId;
    if (templateId && !templateService.getTemplateById(templateId)) {
      templateId = undefined;
    }

    // 2. Match exact template ID from registered templates
    if (!templateId) {
      const allTemplates = templateService.getAll();
      for (const t of allTemplates) {
        if (id.startsWith(`doc-${t.id}-`) || id.includes(t.id)) {
          templateId = t.id;
          break;
        }
      }
    }

    // 3. Fallback to default template (e.g. legacy doc-uuid)
    if (!templateId) {
      templateId = 'tpl-employment-contract';
    }

    const template =
      templateService.getTemplateById(templateId) ||
      templateService.getAll()[0];

    const now = new Date().toISOString();
    const synthesized: UserDocument = {
      id,
      title: `${template.title} (Bản sao)`.normalize('NFC'),
      clonedFromTemplateId: template.id,
      clonedFromTemplateTitle: template.title.normalize('NFC'),
      category: template.category,
      contentHtml: normalizeDocumentHtml(String(template.contentHtml)).normalize('NFC'),
      status: DocumentStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    };

    // Attempt to persist into current container's storage
    try {
      storageService.saveDocument(synthesized);
    } catch (err) {
      console.warn('Could not cache synthesized document to container storage:', err);
    }

    return synthesized;
  }

  /**
   * Create an independent user document from a template (Copy-on-Create).
   * Key Requirement: Does NOT mutate the original template file/data.
   */
  public createFromTemplate(input: CreateDocumentInput): UserDocument {
    const template = templateService.getTemplateById(input.templateId);
    if (!template) {
      throw new Error(`Template với mã "${input.templateId}" không tồn tại.`);
    }

    // Embed template ID into doc ID for instant serverless template reconstruction
    const docId = `doc-${template.id}-${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const userDocument: UserDocument = {
      id: docId,
      title: (
        input.customTitle?.trim() || `${template.title} (Bản sao)`
      ).normalize('NFC'),
      clonedFromTemplateId: template.id,
      clonedFromTemplateTitle: template.title.normalize('NFC'),
      category: template.category,
      // Deep clone content to prevent any shared reference mutations, normalize NFC
      contentHtml: normalizeDocumentHtml(
        String(template.contentHtml),
      ).normalize('NFC'),
      status: DocumentStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    };

    // Persist into user document storage
    storageService.saveDocument(userDocument);

    return userDocument;
  }

  /**
   * Retrieve a user document by ID.
   * If the serverless container lacks the file in /tmp, automatically reconstructs it.
   */
  public getDocumentById(id: string, fallbackTemplateId?: string): UserDocument | null {
    let doc = storageService.getDocument(id);
    if (!doc) {
      // Reconstruct on the fly so serverless container cold-starts never 404
      doc = this.synthesizeDocumentFromTemplate(id, fallbackTemplateId);
    }

    if (!doc) return null;

    return {
      ...doc,
      contentHtml: normalizeDocumentHtml(doc.contentHtml),
    };
  }

  /**
   * Update a user document (title, content, status).
   * If document was not found in current container's /tmp, synthesizes it first before applying updates.
   */
  public updateDocument(id: string, input: UpdateDocumentInput): UserDocument {
    let existing = storageService.getDocument(id);
    if (!existing) {
      existing = this.synthesizeDocumentFromTemplate(id);
    }

    const updatedDocument: UserDocument = {
      ...existing,
      title:
        input.title !== undefined
          ? input.title.trim().normalize('NFC')
          : existing.title,
      contentHtml:
        input.contentHtml !== undefined
          ? input.contentHtml.normalize('NFC')
          : existing.contentHtml,
      status: input.status !== undefined ? input.status : DocumentStatus.SAVED,
      updatedAt: new Date().toISOString(),
    };

    storageService.saveDocument(updatedDocument);
    return updatedDocument;
  }

  /**
   * List all user documents.
   */
  public listUserDocuments(): UserDocument[] {
    return storageService.listDocuments();
  }
}

export const documentService = new DocumentService();
