import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { HandlerBase } from "../base/handlerBase.js";
import { IMcpServer } from "../../core/interfaces/mcpServer.interface.js";

/**
 * 프롬프트 요청을 처리하는 핸들러
 */
export class PromptsHandler extends HandlerBase {
  constructor(server: IMcpServer) {
    super(server);
  }

  /**
   * 핸들러 등록
   */
  override register(): void {
    this.server.registerHandler(
      ListPromptsRequestSchema,
      this.handleListPrompts.bind(this)
    );
    this.server.registerHandler(
      GetPromptRequestSchema,
      this.handleGetPrompt.bind(this)
    );
  }

  /**
   * 프롬프트 목록 요청 처리
   */
  private async handleListPrompts() {
    return {
      prompts: [
        {
          name: "product_api_help",
          description: "상품 API 사용 방법을 설명하는 프롬프트입니다.",
        },
      ],
    };
  }

  /**
   * 특정 프롬프트 요청 처리
   */
  private async handleGetPrompt(request: any) {
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
  }
}
