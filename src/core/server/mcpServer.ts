import { Server as McpServer } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { IMcpServer } from "../interfaces/mcpServer.interface.js";
import { AppConfig } from "../../config/config.js";

/**
 * MCP 서버 구현체
 */
export class McpServerImpl implements IMcpServer {
  private server: McpServer;

  /**
   * @param config 애플리케이션 설정
   */
  constructor(config: AppConfig) {
    this.server = new McpServer(
      {
        name: config.server.name,
        version: config.server.version,
      },
      {
        capabilities: {
          resources: {},
          tools: {},
          prompts: {},
        },
      }
    );
  }

  /**
   * 서버 인스턴스 반환
   */
  getServer(): McpServer {
    return this.server;
  }

  /**
   * 요청 핸들러 등록
   */
  registerHandler(schema: any, handler: any): void {
    this.server.setRequestHandler(schema, handler);
  }

  /**
   * 서버 시작
   */
  async start(transport: StdioServerTransport): Promise<void> {
    await this.server.connect(transport);
  }
}
