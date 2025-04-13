import { ListResourcesRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { HandlerBase } from "../base/handlerBase.js";
import { IMcpServer } from "../../core/interfaces/mcpServer.interface.js";

/**
 * 리소스 요청을 처리하는 핸들러
 */
export class ResourcesHandler extends HandlerBase {
  constructor(server: IMcpServer) {
    super(server);
  }

  /**
   * 핸들러 등록
   */
  register(): void {
    this.server.registerHandler(ListResourcesRequestSchema, this.handleListResources.bind(this));
  }

  /**
   * 리소스 목록 요청 처리
   */
  private async handleListResources() {
    return {
      resources: [
        {
          uri: `test:///`,
          mimeType: "text/plain",
        },
      ],
    };
  }
}
