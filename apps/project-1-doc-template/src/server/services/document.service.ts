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

class DocumentService {
  /**
   * Create an independent user document from a template (Copy-on-Create).
   * Key Requirement: Does NOT mutate the original template file/data.
   */
  public createFromTemplate(input: CreateDocumentInput): UserDocument {
    const template = templateService.getTemplateById(input.templateId);
    if (!template) {
      throw new Error(`Template với mã "${input.templateId}" không tồn tại.`);
    }

    const docId = `doc-${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const userDocument: UserDocument = {
      id: docId,
      title: input.customTitle?.trim() || `${template.title} (Bản sao)`,
      clonedFromTemplateId: template.id,
      clonedFromTemplateTitle: template.title,
      category: template.category,
      // Deep clone content to prevent any shared reference mutations
      contentHtml: String(template.contentHtml),
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
   */
  public getDocumentById(id: string): UserDocument | null {
    return storageService.getDocument(id);
  }

  /**
   * Update a user document (title, content, status).
   */
  public updateDocument(id: string, input: UpdateDocumentInput): UserDocument {
    const existing = storageService.getDocument(id);
    if (!existing) {
      throw new Error(`Tài liệu với mã "${id}" không tồn tại.`);
    }

    const updatedDocument: UserDocument = {
      ...existing,
      title: input.title !== undefined ? input.title.trim() : existing.title,
      contentHtml: input.contentHtml !== undefined ? input.contentHtml : existing.contentHtml,
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

