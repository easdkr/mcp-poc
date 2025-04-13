/**
 * 도구 핸들러 인터페이스
 * 각 도구 핸들러는 이 인터페이스를 구현해야 합니다.
 */
export interface IToolHandler {
  /**
   * 도구의 이름을 반환합니다.
   */
  getName(): string;

  /**
   * 도구의 설명을 반환합니다.
   */
  getDescription(): string;

  /**
   * 도구의 입력 스키마를 반환합니다.
   */
  getInputSchema(): any;

  /**
   * 도구 호출을 처리합니다.
   * @param args 도구 호출 인자
   */
  execute(args: any): Promise<{ content: Array<{ type: string; text: string }> }>;
}
