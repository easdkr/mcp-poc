/**
 * 애플리케이션 설정
 */
export interface AppConfig {
  /**
   * API 서버 기본 URL
   */
  apiBaseUrl: string;

  /**
   * 서버 정보
   */
  server: {
    name: string;
    version: string;
  };

  /**
   * 기능 플래그
   */
  features: {
    /**
     * API 응답 캐싱 활성화 여부
     */
    enableCaching: boolean;
  };
}

/**
 * 기본 애플리케이션 설정
 */
export const config: AppConfig = {
  /**
   * API 서버 주소
   * 필요에 따라 이 값을 변경해주세요
   */
  apiBaseUrl: 'http://localhost:3000',

  /**
   * 서버 정보
   */
  server: {
    name: 'mcp-tutorial',
    version: '0.1.0',
  },

  /**
   * 기능 플래그
   */
  features: {
    enableCaching: false,
  },
};
