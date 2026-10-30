/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig } from 'axios';

export interface RequestConfig extends AxiosRequestConfig {
  /** Tắt tự động hiển thị Toast lỗi khi API fail */
  disabledToast?: boolean;
  /** Chỉ hiển thị thông điệp lỗi, ẩn tiền tố tên field (vd: ẩn 'phone: ') */
  hideErrorKey?: boolean;
  /** Object chứa các param URL động, vd: { id: 123 } cho url '/doctors/:id' */
  pathParams?: Record<string, string | number>;
}

export interface BaseResponse<T> {
  code: 'success' | 'error' | string;
  message: string;
  data: T;
  error?: any;
  errors?: unknown;
}

export interface Paging<T> {
  items: T[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
  };
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export class ApiError extends Error {
  public response: { data: any };
  public isHandled: boolean;
  public statusCode?: number;

  constructor(message: string, data: any, isHandled: boolean = false, statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.response = { data };
    this.isHandled = isHandled;
    this.statusCode = statusCode;
  }
}

