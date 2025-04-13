import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { HandlerBase } from "../base/handlerBase.js";
import { IMcpServer } from "../../core/interfaces/mcpServer.interface.js";
import { IToolHandler } from "./interfaces/toolHandler.interface.js";

/**
 * 도구 핸들러 등록 및 관리를 담당하는 레지스트리
 */
export class ToolsRegistry extends HandlerBase {
  private tools: Map<string, IToolHandler> = new Map();

  constructor(server: IMcpServer) {
    super(server);
  }

  /**
   * 도구를 레지스트리에 등록
   * @param handler 도구 핸들러
   */
  registerTool(handler: IToolHandler): void {
    this.tools.set(handler.getName(), handler);
  }

  /**
   * 모든 핸들러를 MCP 서버에 등록
   */
  register(): void {
    this.server.registerHandler(ListToolsRequestSchema, this.handleListTools.bind(this));
    this.server.registerHandler(CallToolRequestSchema, this.handleCallTool.bind(this));
  }

  /**
   * 도구 목록 요청 처리
   */
  private async handleListTools() {
    const toolDefinitions = Array.from(this.tools.values()).map(tool => ({
      name: tool.getName(),
      description: tool.getDescription(),
      inputSchema: tool.getInputSchema()
    }));

    return {
      tools: toolDefinitions
    };
  }

  /**
   * 도구 호출 요청 처리
   */
  private async handleCallTool(request: any) {
    const toolName = request.params.name;
    const toolHandler = this.tools.get(toolName);

    if (!toolHandler) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    return await toolHandler.execute(request.params.arguments);
  }
}
