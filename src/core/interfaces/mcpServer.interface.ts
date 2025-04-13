import { Server as McpServer } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

/**
 * MCP 서버 인터페이스
 */
export interface IMcpServer {
  /**
   * 서버 인스턴스를 반환
   */
  getServer(): McpServer;

  /**
   * 요청 핸들러를 등록
   * @param schema 요청 스키마
   * @param handler 핸들러 함수
   */
  registerHandler(schema: any, handler: any): void;

  /**
   * 전송 계층에 연결하고 서버 시작
   * @param transport 전송 계층 구현체
   */
  start(transport: StdioServerTransport): Promise<void>;
}
