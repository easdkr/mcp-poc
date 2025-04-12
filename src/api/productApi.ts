import axios from 'axios';
import { CreateProductDto, ProductDto, ProductListDto, ProductsQueryParams } from '../types/product.js';
import { config } from '../config.js';

/**
 * 제품 API 기본 설정
 */
const API_BASE_URL = config.apiBaseUrl;

/**
 * 제품 API 클라이언트
 */
export class ProductApiClient {
  private baseUrl: string;

  /**
   * @param baseUrl API 서버 주소 (기본값: config.apiBaseUrl)
   */
  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * 제품 목록 조회
   * @param params 조회 파라미터 (페이지, 한 페이지당 항목 수, 검색어)
   * @returns 제품 목록 및 페이지 정보
   */
  async getProducts(params?: ProductsQueryParams): Promise<ProductListDto> {
    try {
      const response = await axios.get<ProductListDto>(`${this.baseUrl}/products`, {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`제품 목록 조회 실패: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * 제품 상세 조회
   * @param id 제품 ID
   * @returns 제품 상세 정보
   */
  async getProduct(id: number): Promise<ProductDto> {
    try {
      const response = await axios.get<ProductDto>(`${this.baseUrl}/products/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`제품 상세 조회 실패: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * 제품 생성
   * @param productData 생성할 제품 정보
   * @returns 생성된 제품 정보
   */
  async createProduct(productData: CreateProductDto): Promise<ProductDto> {
    try {
      const response = await axios.post<ProductDto>(`${this.baseUrl}/products`, productData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`제품 생성 실패: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * API 연결 테스트
   * @returns 연결 상태 메시지
   */
  async testConnection(): Promise<string> {
    try {
      await axios.get(`${this.baseUrl}/products`, { params: { limit: 1 } });
      return '연결 성공: 제품 API 서버가 정상적으로 응답하고 있습니다.';
    } catch (error) {
      return `연결 실패: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
}

// 기본 API 클라이언트 인스턴스
export const productApi = new ProductApiClient();
