import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IHttpClient } from '../interfaces/httpClient.interface.js';

/**
 * Axios를 사용한 HTTP 클라이언트 구현체
 */
export class AxiosHttpClient implements IHttpClient {
  private client: AxiosInstance;

  /**
   * @param baseURL API 기본 URL
   * @param config Axios 추가 설정
   */
  constructor(baseURL: string, config: AxiosRequestConfig = {}) {
    this.client = axios.create({
      baseURL,
      ...config
    });
  }

  /**
   * GET 요청 구현
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.client.get<T>(url, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error; // TypeScript를 위한 코드 (실제로는 위 라인에서 예외가 발생)
    }
  }

  /**
   * POST 요청 구현
   */
  async post<T>(url: string, data: any): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * PUT 요청 구현
   */
  async put<T>(url: string, data: any): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * DELETE 요청 구현
   */
  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.client.delete<T>(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * 에러 처리 헬퍼 메소드
   * @param error 발생한 에러
   */
  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 'unknown';
      const message = error.response?.data?.message || error.message;
      throw new Error(`API 요청 실패 (${statusCode}): ${message}`);
    }
    throw error;
  }
}
