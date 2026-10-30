import { BaseApiService } from '@/services/core/base-api.service';
import { Template, TemplateListResponse } from '@/types';

export interface TemplateFilterParams {
  category?: string;
  search?: string;
}

class TemplateApiService extends BaseApiService {
  async getTemplates(params?: TemplateFilterParams): Promise<TemplateListResponse> {
    const res = await this._get<TemplateListResponse>('/api/templates', params);
    return res.data;
  }

  async getTemplateById(id: string): Promise<Template> {
    const res = await this._get<Template>('/api/templates/:id', null, {
      pathParams: { id },
    });
    return res.data;
  }
}

export const templateApiService = new TemplateApiService();
