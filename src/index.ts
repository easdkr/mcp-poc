#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "./config/config.js";
import { AxiosHttpClient } from "./api/clients/axiosHttpClient.js";
import { ProductService } from "./api/services/productService.js";
import { McpServerImpl } from "./core/server/mcpServer.js";
import { ResourcesHandler } from "./handlers/resources/resourcesHandler.js";
import { PromptsHandler } from "./handlers/prompts/promptsHandler.js";
import { ToolsRegistry } from "./handlers/tools/toolsRegistry.js";
import {
  GetProductsToolHandler,
  GetProductDetailToolHandler,
  CreateProductToolHandler,
  TestApiConnectionToolHandler,
} from "./handlers/tools/productToolHandler.js";

/**
 * 메인 함수 - 애플리케이션 진입점
 */
async function bootstrap() {
  // HTTP 클라이언트 생성
  const httpClient = new AxiosHttpClient(config.apiBaseUrl);

  // 제품 서비스 생성
  const productService = new ProductService(httpClient);

  // MCP 서버 생성
  const mcpServer = new McpServerImpl(config);

  // 핸들러 등록
  const resourcesHandler = new ResourcesHandler(mcpServer);
  resourcesHandler.register();

  const promptsHandler = new PromptsHandler(mcpServer);
  promptsHandler.register();

  // 도구 레지스트리 생성 및 핸들러 등록
  const toolsRegistry = new ToolsRegistry(mcpServer);

  // 각 도구 핸들러 생성 및 등록
  toolsRegistry.registerTool(new GetProductsToolHandler(productService));
  toolsRegistry.registerTool(new GetProductDetailToolHandler(productService));
  toolsRegistry.registerTool(new CreateProductToolHandler(productService));
  toolsRegistry.registerTool(new TestApiConnectionToolHandler(productService));

  // 도구 핸들러 최종 등록
  toolsRegistry.register();

  // 서버 시작
  const transport = new StdioServerTransport();
  await mcpServer.start(transport);
}

// 애플리케이션 시작
bootstrap().catch((error) => {
  console.error("Error starting application:", error);
  process.exit(1);
});
