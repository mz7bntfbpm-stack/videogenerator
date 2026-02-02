import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ApiResponse, ApiError } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          const errorCode = error.response.data?.error?.code;

          if (errorCode === 'AUTH_EXPIRED' && this.refreshToken) {
            try {
              await this.refreshTokens();
              // Retry original request
              return this.client.request(error.config!);
            } catch {
              this.clearTokens();
              window.location.href = '/';
            }
          } else if (errorCode === 'AUTH_INVALID' || errorCode === 'AUTH_REQUIRED') {
            this.clearTokens();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== 'undefined') {
      document.cookie = `vg_access_token=${accessToken}; path=/; secure; samesite=strict`;
      document.cookie = `vg_refresh_token=${refreshToken}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`;
    }
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      document.cookie = 'vg_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'vg_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  async refreshTokens(): Promise<void> {
    const response = await this.client.post<ApiResponse<{ accessToken: string; expiresAt: number }>>('/auth/refresh', {
      refreshToken: this.refreshToken,
    });
    if (response.data.success && response.data.data) {
      this.accessToken = response.data.data.accessToken;
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

export const api = new ApiClient();
export default api;