import { IMcpServer } from "../../core/interfaces/mcpServer.interface.js";

/**
 * 모든 핸들러의 기본 추상 클래스
 */
export abstract class HandlerBase {
  constructor(protected readonly server: IMcpServer) {}

  /**
   * 핸들러를 등록합니다.
   * 이 메서드는 각 파생 클래스에서 구현해야 합니다.
   */
  abstract register(): void;
}
