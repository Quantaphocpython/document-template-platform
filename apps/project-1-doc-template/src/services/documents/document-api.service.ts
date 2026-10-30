import { BaseApiService } from '@/services/core/base-api.service';
import { sanitizeFileName } from '@preview/core';
import { UserDocument } from '@/types';

export interface CreateDocumentPayload {
  templateId: string;
  customTitle?: string;
}

export interface UpdateDocumentPayload {
  title?: string;
  contentHtml?: string;
  status?: string;
}

class DocumentApiService extends BaseApiService {
  async createFromTemplate(payload: CreateDocumentPayload): Promise<UserDocument> {
    const res = await this._post<UserDocument>('/api/documents', payload);
    return res.data;
  }

  async getDocumentById(id: string): Promise<UserDocument> {
    const res = await this._get<UserDocument>('/api/documents/:id', null, {
      pathParams: { id },
    });
    return res.data;
  }

  async updateDocument(id: string, payload: UpdateDocumentPayload): Promise<UserDocument> {
    const res = await this._put<UserDocument>('/api/documents/:id', payload, {
      pathParams: { id },
    });
    return res.data;
  }

  async downloadDocx(id: string, fileName: string): Promise<void> {
    const blob = await this.downloadBlob('/api/documents/:id/export', {
      pathParams: { id },
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${sanitizeFileName(fileName)}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }
}

export const documentApiService = new DocumentApiService();
