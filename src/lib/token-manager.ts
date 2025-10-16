// 토큰 관리 유틸리티

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = "access_token";
  private static readonly TOKEN_EXPIRES_KEY = "token_expires";

  // 토큰을 HttpOnly 쿠키에 저장하는 것이 이상적이지만,
  // 클라이언트에서 접근이 필요한 경우를 위한 대안 구현
  static setTokens(
    accessToken: string,
    _refreshToken?: string,
    expiresIn?: number,
  ) {
    // 액세스 토큰은 sessionStorage에 저장 (새로고침시 초기화됨)
    if (typeof window !== "undefined") {
      sessionStorage.setItem(TokenManager.ACCESS_TOKEN_KEY, accessToken);

      // 리프레시 토큰은 httpOnly 쿠키로 서버에서 관리되므로 클라이언트에서 저장하지 않음
      // if (refreshToken) {
      //   localStorage.setItem(TokenManager.REFRESH_TOKEN_KEY, refreshToken);
      // }

      if (expiresIn) {
        const expirationTime = Date.now() + expiresIn * 1000;
        localStorage.setItem(
          TokenManager.TOKEN_EXPIRES_KEY,
          expirationTime.toString(),
        );
      }
    }
  }

  static getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(TokenManager.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    // 리프레시 토큰은 httpOnly 쿠키로 관리되므로 클라이언트에서 접근 불가
    return null;
  }

  static getTokenExpiration(): number | null {
    if (typeof window === "undefined") return null;
    const expires = localStorage.getItem(TokenManager.TOKEN_EXPIRES_KEY);
    return expires ? parseInt(expires, 10) : null;
  }

  static isTokenExpired(): boolean {
    const expiration = TokenManager.getTokenExpiration();
    if (!expiration) return false;
    return Date.now() > expiration;
  }

  static isTokenExpiringSoon(minutesBeforeExpiry = 5): boolean {
    const expiration = TokenManager.getTokenExpiration();
    if (!expiration) return false;
    const warningTime = expiration - minutesBeforeExpiry * 60 * 1000;
    return Date.now() > warningTime;
  }

  static clearTokens() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(TokenManager.ACCESS_TOKEN_KEY);
    // 리프레시 토큰은 httpOnly 쿠키이므로 서버에서 만료 처리
    localStorage.removeItem(TokenManager.TOKEN_EXPIRES_KEY);
  }

  static hasValidToken(): boolean {
    const token = TokenManager.getAccessToken();
    return !!token && !TokenManager.isTokenExpired();
  }
}

// JWT 토큰 파싱 유틸리티 (보안상 서버에서 검증 필요)
export function parseJwtPayload(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT 파싱 실패:", error);
    return null;
  }
}

// 토큰에서 만료 시간 추출
export function getTokenExpiry(token: string): number | null {
  const payload = parseJwtPayload(token);
  return payload?.exp ? payload.exp * 1000 : null;
}
