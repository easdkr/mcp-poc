#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { productApi } from "./api/productApi.js";
import { CreateProductDto, ProductsQueryParams } from "./types/product.js";
import { config } from "./config.js";

/**
 * 기능을 갖춘 MCP 서버를 생성합니다.
 */
const server = new Server(
  {
    name: "mcp-tutorial",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

/**
 * 리소스 목록을 처리하는 핸들러입니다.
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: `test:///`,
        mimeType: "text/plain",
      },
    ],
  };
});

/**
 * 사용 가능한 도구를 나열하는 핸들러입니다.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_api_data",
        description:
          "API를 호출하여 데이터를 가져옵니다. 어떤 정보가 필요한지 자연스럽게 물어보세요.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_products",
        description:
          "상품 목록을 조회합니다. 페이지, 한 페이지당 항목 수, 검색어를 지정할 수 있습니다.",
        inputSchema: {
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
        },
      },
      {
        name: "get_product_detail",
        description: "상품 상세 정보를 조회합니다.",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "조회할 상품의 ID",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "create_product",
        description: "새로운 상품을 생성합니다.",
        inputSchema: {
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
        },
      },
      {
        name: "test_api_connection",
        description: "제품 API 서버 연결을 테스트합니다.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

/**
 * 도구 호출을 처리하는 핸들러입니다.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "get_api_data": {
      try {
        const res = await axios.get(config.apiBaseUrl);
        const userMessage = request.params.arguments?.message || "";

        let responseText = "";
        if (userMessage) {
          responseText = `당신의 요청 "${userMessage}"에 대한 API 응답입니다: ${res.data}`;
        } else {
          responseText = `API에서 다음 정보를 가져왔습니다: ${res.data}`;
        }

        return {
          content: [
            {
              type: "text",
              text: responseText,
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `API 호출 중 오류가 발생했습니다: ${error.message}`,
            },
          ],
        };
      }
    }

    case "get_products": {
      try {
        const arg = request.params.arguments as any;
        const params: ProductsQueryParams = {
          page: arg?.page || 1,
          limit: arg?.limit,
          search: arg?.search,
        };

        const products = await productApi.getProducts(params);

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

    case "get_product_detail": {
      try {
        const id = request.params.arguments?.id as number;

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

        const product = await productApi.getProduct(id);

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

    case "create_product": {
      const arg = request.params.arguments as any;
      try {
        const productData: CreateProductDto = {
          name: arg?.name,
          description: arg?.description,
          price: arg?.price,
          stockQuantity: arg?.stockQuantity,
          imageUrl: arg?.imageUrl,
        };

        // 필수 필드 검증
        const requiredFields = [
          "name",
          "description",
          "price",
          "stockQuantity",
        ];
        const missingFields = requiredFields.filter(
          (field) => !productData[field as keyof CreateProductDto]
        );

        if (missingFields.length > 0) {
          return {
            content: [
              {
                type: "text",
                text: `다음 필수 정보가 누락되었습니다: ${missingFields.join(
                  ", "
                )}`,
              },
            ],
          };
        }

        const createdProduct = await productApi.createProduct(productData);

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

    case "test_api_connection": {
      try {
        const result = await productApi.testConnection();

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

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * 사용 가능한 프롬프트를 나열하는 핸들러입니다.
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "product_api_help",
        description: "상품 API 사용 방법을 설명하는 프롬프트입니다.",
      },
    ],
  };
});

/**
 * 프롬프트 요청을 처리하는 핸들러입니다.
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== "product_api_help") {
    throw new Error("Unknown prompt");
  }

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "상품 API를 사용하는 방법을 알려주세요. 사용 가능한 기능과 예시를 포함해 주세요.",
        },
      },
    ],
  };
});

/**
 * stdio 전송을 사용하여 서버를 시작합니다.
 * 이를 통해 서버는 표준 입출력 스트림을 통해 통신할 수 있습니다.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
