/**
 * HTTP 클라이언트 인터페이스
 * 다양한 HTTP 클라이언트 구현체가 준수해야 할 계약을 정의합니다.
 */
export interface IHttpClient {
  /**
   * GET 요청을 보냅니다.
   * @param url 요청 URL
   * @param params 쿼리 파라미터
   * @returns 응답 데이터
   */
  get<T>(url: string, params?: Record<string, any>): Promise<T>;

  /**
   * POST 요청을 보냅니다.
   * @param url 요청 URL
   * @param data 요청 바디 데이터
   * @returns 응답 데이터
   */
  post<T>(url: string, data: any): Promise<T>;

  /**
   * PUT 요청을 보냅니다.
   * @param url 요청 URL
   * @param data 요청 바디 데이터
   * @returns 응답 데이터
   */
  put<T>(url: string, data: any): Promise<T>;

  /**
   * DELETE 요청을 보냅니다.
   * @param url 요청 URL
   * @returns 응답 데이터
   */
  delete<T>(url: string): Promise<T>;
}
