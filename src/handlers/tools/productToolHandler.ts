import { IToolHandler } from "./interfaces/toolHandler.interface.js";
import { IProductService } from "../../api/services/productService.js";
import { CreateProductDto, ProductsQueryParams } from "../../types/product.js";

/**
 * 제품 목록 조회 도구 핸들러
 */
export class GetProductsToolHandler implements IToolHandler {
  constructor(private readonly productService: IProductService) {}

  getName(): string {
    return "get_products";
  }

  getDescription(): string {
    return "상품 목록을 조회합니다. 페이지, 한 페이지당 항목 수, 검색어를 지정할 수 있습니다.";
  }

  getInputSchema(): any {
    return {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "페이지 번호 (기본값: 1)",
        },
        limit: {
          type: "number",
          description: "페이지당 항목 수 (기본값: 10)",
        },
        search: {
          type: "string",
          description: "검색어",
        },
      },
    };
  }

  async execute(args: any): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const params: ProductsQueryParams = {
        page: args?.page || 1,
        limit: args?.limit,
        search: args?.search,
      };

      const products = await this.productService.getProducts(params);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(products, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `상품 목록 조회 중 오류가 발생했습니다: ${error.message}`,
          },
        ],
      };
    }
  }
}

/**
 * 제품 상세 조회 도구 핸들러
 */
export class GetProductDetailToolHandler implements IToolHandler {
  constructor(private readonly productService: IProductService) {}

  getName(): string {
    return "get_product_detail";
  }

  getDescription(): string {
    return "상품 상세 정보를 조회합니다.";
  }

  getInputSchema(): any {
    return {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "조회할 상품의 ID",
        },
      },
      required: ["id"],
    };
  }

  async execute(args: any): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const id = args?.id as number;

      if (!id) {
        return {
          content: [
            {
              type: "text",
              text: "상품 ID를 입력해주세요.",
            },
          ],
        };
      }

      const product = await this.productService.getProduct(id);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(product, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `상품 상세 조회 중 오류가 발생했습니다: ${error.message}`,
          },
        ],
      };
    }
  }
}

/**
 * 제품 생성 도구 핸들러
 */
export class CreateProductToolHandler implements IToolHandler {
  constructor(private readonly productService: IProductService) {}

  getName(): string {
    return "create_product";
  }

  getDescription(): string {
    return "새로운 상품을 생성합니다.";
  }

  getInputSchema(): any {
    return {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "상품명",
        },
        description: {
          type: "string",
          description: "상품 설명",
        },
        price: {
          type: "number",
          description: "가격",
        },
        stockQuantity: {
          type: "number",
          description: "재고 수량",
        },
        imageUrl: {
          type: "string",
          description: "이미지 URL (선택사항)",
        },
      },
      required: ["name", "description", "price", "stockQuantity"],
    };
  }

  async execute(args: any): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const productData: CreateProductDto = {
        name: args?.name,
        description: args?.description,
        price: args?.price,
        stockQuantity: args?.stockQuantity,
        imageUrl: args?.imageUrl,
      };

      // 필수 필드 검증
      const requiredFields = ["name", "description", "price", "stockQuantity"];
      const missingFields = requiredFields.filter(
        (field) => !productData[field as keyof CreateProductDto]
      );

      if (missingFields.length > 0) {
        return {
          content: [
            {
              type: "text",
              text: `다음 필수 정보가 누락되었습니다: ${missingFields.join(", ")}`,
            },
          ],
        };
      }

      const createdProduct = await this.productService.createProduct(productData);

      return {
        content: [
          {
            type: "text",
            text: `상품이 성공적으로 생성되었습니다:\n${JSON.stringify(
              createdProduct,
              null,
              2
            )}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `상품 생성 중 오류가 발생했습니다: ${error.message}`,
          },
        ],
      };
    }
  }
}

/**
 * API 연결 테스트 도구 핸들러
 */
export class TestApiConnectionToolHandler implements IToolHandler {
  constructor(private readonly productService: IProductService) {}

  getName(): string {
    return "test_api_connection";
  }

  getDescription(): string {
    return "제품 API 서버 연결을 테스트합니다.";
  }

  getInputSchema(): any {
    return {
      type: "object",
      properties: {},
    };
  }

  async execute(args: any): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const result = await this.productService.testConnection();

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `API 연결 테스트 중 오류가 발생했습니다: ${error.message}`,
          },
        ],
      };
    }
  }
}
