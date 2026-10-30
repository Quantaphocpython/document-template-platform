import { BaseApiService } from '@/services/core/base-api.service';
import { UserPresentation } from '@/types';

export interface CreatePresentationPayload {
  templateId: string;
  customTitle?: string;
}

class PresentationApiService extends BaseApiService {
  async createFromTemplate(payload: CreatePresentationPayload): Promise<UserPresentation> {
    const res = await this._post<UserPresentation>('/api/presentations', payload);
    return res.data;
  }

  async getPresentationById(id: string): Promise<UserPresentation> {
    const res = await this._get<UserPresentation>('/api/presentations/:id', null, {
      pathParams: { id },
    });
    return res.data;
  }

  async downloadPptx(id: string, fileName?: string): Promise<void> {
    const blob = await this.downloadBlob('/api/presentations/:id/download', {
      pathParams: { id },
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName ? `${fileName}.pptx` : `${id}.pptx`;
    window.document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }
}

export const presentationApiService = new PresentationApiService();
