import { IHttpClient } from "../interfaces/httpClient.interface.js";
import {
  CreateProductDto,
  ProductDto,
  ProductListDto,
  ProductsQueryParams,
} from "../../types/product.js";

/**
 * 제품 서비스 인터페이스
 */
export interface IProductService {
  /**
   * 제품 목록 조회
   */
  getProducts(params?: ProductsQueryParams): Promise<ProductListDto>;

  /**
   * 제품 상세 조회
   */
  getProduct(id: number): Promise<ProductDto>;

  /**
   * 제품 생성
   */
  createProduct(productData: CreateProductDto): Promise<ProductDto>;

  /**
   * API 연결 테스트
   */
  testConnection(): Promise<string>;
}

/**
 * 제품 서비스 구현체
 */
export class ProductService implements IProductService {
  /**
   * @param httpClient HTTP 클라이언트 인터페이스
   */
  constructor(private readonly httpClient: IHttpClient) {}

  /**
   * 제품 목록 조회
   * @param params 조회 파라미터 (페이지, 한 페이지당 항목 수, 검색어)
   * @returns 제품 목록 및 페이지 정보
   */
  async getProducts(params?: ProductsQueryParams): Promise<ProductListDto> {
    try {
      return await this.httpClient.get<ProductListDto>("/products", {
        page: params?.page || 1,
        limit: params?.limit || 10,
        search: params?.search,
      });
    } catch (error) {
      throw new Error(
        `제품 목록 조회 실패: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * 제품 상세 조회
   * @param id 제품 ID
   * @returns 제품 상세 정보
   */
  async getProduct(id: number): Promise<ProductDto> {
    try {
      return await this.httpClient.get<ProductDto>(`/products/${id}`);
    } catch (error) {
      throw new Error(
        `제품 상세 조회 실패: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * 제품 생성
   * @param productData 생성할 제품 정보
   * @returns 생성된 제품 정보
   */
  async createProduct(productData: CreateProductDto): Promise<ProductDto> {
    try {
      return await this.httpClient.post<ProductDto>("/products", productData);
    } catch (error) {
      throw new Error(
        `제품 생성 실패: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * API 연결 테스트
   * @returns 연결 상태 메시지
   */
  async testConnection(): Promise<string> {
    try {
      await this.httpClient.get<{ items: any[] }>("/products", { limit: 1 });
      return "연결 성공: 제품 API 서버가 정상적으로 응답하고 있습니다.";
    } catch (error) {
      return `연결 실패: ${
        error instanceof Error ? error.message : String(error)
      }`;
    }
  }
}
