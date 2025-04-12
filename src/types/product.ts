/**
 * 제품 정보 DTO
 */
export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 제품 목록 DTO
 */
export interface ProductListDto {
  items: ProductDto[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 제품 생성 DTO
 */
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
}

/**
 * 제품 조회 쿼리 파라미터
 */
export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
