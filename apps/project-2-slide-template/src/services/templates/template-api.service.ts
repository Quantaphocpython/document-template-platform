import { BaseApiService } from '@/services/core/base-api.service';
import { SlideTemplate, SlideTemplateListResponse } from '@/types';

export interface SlideTemplateFilterParams {
  category?: string;
  search?: string;
}

class TemplateApiService extends BaseApiService {
  async getTemplates(params?: SlideTemplateFilterParams): Promise<SlideTemplateListResponse> {
    const res = await this._get<SlideTemplateListResponse>('/api/templates', params);
    return res.data;
  }

  async getTemplateById(id: string): Promise<SlideTemplate> {
    const res = await this._get<SlideTemplate>('/api/templates/:id', null, {
      pathParams: { id },
    });
    return res.data;
  }
}

export const templateApiService = new TemplateApiService();
