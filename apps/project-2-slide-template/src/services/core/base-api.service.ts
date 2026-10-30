/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponseTransformer,
  isCancel,
} from 'axios';
import { BASE_API, DEFAULT_TIMEOUT } from '@/shared/constants/server';
import { toast } from '@/shared/utils/toast-helper';
import { useAuthStore } from '@/store/auth.store';
import { useAppStore } from '@/store/app.store';
import { ApiError, BaseResponse, HttpMethod, RequestConfig } from './types';

// Regex loại bỏ tiền tố tên field lỗi từ backend (ví dụ: "id_code: ")
const ERROR_KEY_PREFIX = /^[a-z_][a-z0-9_.]*:\s*/i;

/** Bóc tách và làm phẳng lỗi từ API thành mảng string */
function flattenApiErrors(errors: unknown, hideKey = false): string[] {
  if (!errors) return [];
  const clean = (message: unknown) =>
    hideKey ? String(message).replace(ERROR_KEY_PREFIX, '') : String(message);

  if (typeof errors === 'string') return [clean(errors)];
  if (Array.isArray(errors)) return errors.map(clean);
  if (typeof errors !== 'object') return [String(errors)];

  return Object.entries(errors as Record<string, unknown>).flatMap(([field, value]) => {
    const messages = Array.isArray(value) ? value.map(String) : [String(value)];
    return hideKey ? messages : messages.map((message) => `${field}: ${message}`);
  });
}

/** Format URL có chứa path params động (:id hoặc {id}) */
function formatUrl(url: string, pathParams?: Record<string, string | number>): string {
  if (!pathParams) return url;
  let formattedUrl = url;
  for (const [key, value] of Object.entries(pathParams)) {
    const encodedValue = encodeURIComponent(String(value));
    formattedUrl = formattedUrl.replace(`:${key}`, encodedValue).replace(`{${key}}`, encodedValue);
  }
  return formattedUrl;
}

export abstract class BaseApiService {
  protected readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string = BASE_API) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: DEFAULT_TIMEOUT,
    });

    // Request Interceptor: Tự động đính kèm Bearer Token từ Zustand Store
    this.axiosInstance.interceptors.request.use((config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  private async request<T = any>(
    method: HttpMethod,
    url: string,
    config: RequestConfig = {},
    data?: any
  ): Promise<BaseResponse<T>> {
    try {
      // 1. Kiểm tra mạng offline trước khi gọi
      if (!useAppStore.getState().isOnline()) {
        throw new ApiError('Mất kết nối mạng. Vui lòng kiểm tra lại đường truyền Internet.', null, true);
      }

      // 2. Format URL nếu có pathParams
      const formattedUrl = formatUrl(url, config.pathParams);

      // 3. Chuẩn hóa transformResponse để đồng nhất status code 'success' | 'error'
      const defaultTransforms =
        (axios.defaults.transformResponse as AxiosResponseTransformer[]) || [];
      const normalize = (raw: any) => {
        if (typeof raw === 'string') {
          try {
            raw = JSON.parse(raw);
          } catch {
            return raw;
          }
        }
        return {
          ...raw,
          code: raw?.success || raw?.code === 200 || raw?.code === 'success' ? 'success' : 'error',
        };
      };

      const finalConfig: AxiosRequestConfig = {
        ...config,
        method,
        url: formattedUrl,
        data,
        validateStatus: () => true, // Nhận toàn bộ HTTP status để tự xử lý lỗi tập trung
        transformResponse: [...defaultTransforms, normalize],
        headers: {
          'Content-Type': 'application/json',
          'Api-Language': 'vi',
          ...config.headers,
        },
      };

      const result = await this.axiosInstance.request<BaseResponse<T>>(finalConfig);

      // 4. Xử lý lỗi trả về từ API Backend & Tự động bật Toast
      if (result.data?.code === 'error') {
        const errors = flattenApiErrors(
          result.data.error ?? result.data.errors,
          config.hideErrorKey
        );

        if (!config.disabledToast) {
          const errorMessage =
            errors.length > 0 ? errors.join('\n') : result.data.message || 'Lỗi không xác định từ máy chủ.';
          toast.error(errorMessage, { title: 'Lỗi API' });
        }

        throw new ApiError(
          result.data.message || 'Lỗi không xác định từ máy chủ.',
          result.data,
          !config.disabledToast,
          result.status
        );
      }

      return result.data;
    } catch (error: any) {
      // 5. Xử lý lỗi tầng Network/Timeout
      if (!isCancel(error) && !error.isHandled && !config.disabledToast) {
        toast.error(error.message || 'Lỗi kết nối máy chủ.', { title: 'Lỗi mạng' });
      }
      throw error;
    }
  }

  // --- Các phương thức bọc HTTP Verbs tiện lợi ---
  protected _get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.GET, url, { ...config, params });
  }

  protected _post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.POST, url, config, data);
  }

  protected _put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.PUT, url, config, data);
  }

  protected _patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.PATCH, url, config, data);
  }

  protected _delete<T = any>(url: string, params?: any, config?: RequestConfig): Promise<BaseResponse<T>> {
    return this.request<T>(HttpMethod.DELETE, url, { ...config, params });
  }

  /** Tải file blob nhị phân (DOCX, PPTX) qua Axios */
  public async downloadBlob(url: string, config: RequestConfig = {}): Promise<Blob> {
    const formattedUrl = formatUrl(url, config.pathParams);
    const response = await this.axiosInstance.get(formattedUrl, {
      ...config,
      responseType: 'blob',
    });
    return response.data;
  }
}

